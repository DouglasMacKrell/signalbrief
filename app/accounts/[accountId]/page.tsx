import Link from "next/link";
import { notFound } from "next/navigation";

import { BriefingPanel } from "@/components/briefing-panel";
import { AccountSelector } from "@/components/account-selector";
import { formatRelative, Panel } from "@/components/dashboard-ui";
import {
  EvidenceToggle,
  EvidenceVisibilityProvider,
} from "@/components/evidence-visibility";
import { SentimentBadge } from "@/components/sentiment-badge";
import { RiskCard } from "@/components/risk-card";
import { getAccountContext, getAccounts } from "@/src/domain/account-context";
import { getBriefingProviderLabel, isLlmBriefingConfigured } from "@/src/domain/briefing-provider";
import { buildEvidenceIndex } from "@/src/domain/evidence";
import { calculateRiskSignals } from "@/src/domain/risk-engine";
import { logTelemetry } from "@/src/telemetry/logger";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const [context, allAccounts] = await Promise.all([
    getAccountContext(accountId),
    getAccounts(),
  ]);

  if (!context) notFound();

  logTelemetry({ event: "account_viewed", accountId });

  const risks = calculateRiskSignals(context);
  const evidenceIndex = buildEvidenceIndex(context);
  const { account, opportunity, calls, tickets, health, freshness } = context;
  const configuredProvider = getBriefingProviderLabel();
  const llmBriefing = isLlmBriefingConfigured();

  return (
    <EvidenceVisibilityProvider>
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-700">
              ← SignalBrief
            </Link>
            <h1 className="text-2xl font-bold">{account.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <EvidenceToggle />
            <AccountSelector accounts={allAccounts} currentId={accountId} />
          </div>
        </div>
      </header>

      {freshness.staleSources.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900">
          Stale data from: {freshness.staleSources.join(", ")}. Oldest source
          update {formatRelative(freshness.oldestSourceUpdatedAt)}.
        </div>
      )}

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel title="Account overview">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Industry</dt>
                <dd className="font-medium">{account.industry}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Segment</dt>
                <dd className="font-medium">{account.segment}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Owner</dt>
                <dd className="font-medium">{account.owner}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Data freshness</dt>
                <dd className="font-medium">
                  {formatRelative(freshness.oldestSourceUpdatedAt)}
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Opportunity">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Stage</dt>
                <dd className="font-medium">{opportunity.stage}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Amount</dt>
                <dd className="font-medium">
                  ${opportunity.amount.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Probability</dt>
                <dd className="font-medium">{opportunity.probability}%</dd>
              </div>
              <div>
                <dt className="text-slate-500">Close date</dt>
                <dd className="font-medium">
                  {opportunity.closeDate.toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Days in stage</dt>
                <dd className="font-medium">{opportunity.daysInStage}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Last activity</dt>
                <dd className="font-medium">
                  {formatRelative(opportunity.lastActivityAt)}
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Recent calls">
            <div className="space-y-4">
              {calls.map((call) => (
                <article key={call.id} className="border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">
                      {call.occurredAt.toLocaleDateString()} · {call.owner}
                    </p>
                    <SentimentBadge sentiment={call.sentiment} />
                  </div>
                  <p className="mt-1 font-medium">{call.summary}</p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Themes: {call.themes.join(", ")}
                  </p>
                  {call.excerpts[0] && (
                    <blockquote className="mt-2 border-l-2 border-slate-300 pl-3 text-sm italic text-slate-600 dark:border-slate-700 dark:text-slate-400">
                      {call.excerpts[0]}
                    </blockquote>
                  )}
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Risk signals">
            {risks.length === 0 ? (
              <p className="text-sm text-slate-500">No risk signals detected.</p>
            ) : (
              <div className="space-y-3">
                {risks.map((risk) => (
                  <RiskCard key={risk.id} risk={risk} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Support tickets">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-slate-100 p-3 text-sm dark:border-slate-800"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium capitalize">
                      {ticket.priority} · {ticket.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatRelative(ticket.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1">{ticket.summary}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Product health">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Health score</dt>
                <dd className="text-2xl font-bold">{health.healthScore}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Usage trend</dt>
                <dd className="font-medium capitalize">{health.usageTrend}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Active users</dt>
                <dd className="font-medium">{health.activeUsers}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Last login</dt>
                <dd className="font-medium">
                  {formatRelative(health.lastLoginAt)}
                </dd>
              </div>
            </dl>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <BriefingPanel
            accountId={accountId}
            configuredProvider={configuredProvider}
            llmBriefing={llmBriefing}
            evidenceIndex={evidenceIndex}
          />
        </div>
      </main>
    </div>
    </EvidenceVisibilityProvider>
  );
}
