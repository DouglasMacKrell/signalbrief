import { differenceInDays } from "date-fns";
import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/src/db/client";
import {
  accounts,
  calls,
  healthSnapshots,
  opportunities,
  supportTickets,
} from "@/src/db/schema";
import type {
  Account,
  AccountContext,
  AccountSummary,
  Call,
  DataFreshness,
  HealthSnapshot,
  Opportunity,
  SupportTicket,
} from "@/src/domain/types";

const STALE_DAYS = 7;

function mapAccount(row: typeof accounts.$inferSelect): Account {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    owner: row.owner,
    segment: row.segment,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapOpportunity(row: typeof opportunities.$inferSelect): Opportunity {
  return {
    id: row.id,
    accountId: row.accountId,
    stage: row.stage,
    amount: row.amount,
    probability: row.probability,
    closeDate: row.closeDate,
    daysInStage: row.daysInStage,
    lastActivityAt: row.lastActivityAt,
    owner: row.owner,
    sourceSystem: row.sourceSystem,
    sourceId: row.sourceId,
    sourceUpdatedAt: row.sourceUpdatedAt,
  };
}

function mapCall(row: typeof calls.$inferSelect): Call {
  return {
    id: row.id,
    accountId: row.accountId,
    occurredAt: row.occurredAt,
    owner: row.owner,
    summary: row.summary,
    themes: row.themes,
    excerpts: row.excerpts,
    sentiment: row.sentiment as Call["sentiment"],
    sourceSystem: row.sourceSystem,
    sourceId: row.sourceId,
    sourceUpdatedAt: row.sourceUpdatedAt,
  };
}

function mapTicket(row: typeof supportTickets.$inferSelect): SupportTicket {
  return {
    id: row.id,
    accountId: row.accountId,
    priority: row.priority,
    status: row.status,
    createdAt: row.createdAt,
    summary: row.summary,
    sourceSystem: row.sourceSystem,
    sourceId: row.sourceId,
    sourceUpdatedAt: row.sourceUpdatedAt,
  };
}

function mapHealth(row: typeof healthSnapshots.$inferSelect): HealthSnapshot {
  return {
    id: row.id,
    accountId: row.accountId,
    healthScore: row.healthScore,
    usageTrend: row.usageTrend,
    activeUsers: row.activeUsers,
    lastLoginAt: row.lastLoginAt,
    sourceSystem: row.sourceSystem,
    sourceId: row.sourceId,
    sourceUpdatedAt: row.sourceUpdatedAt,
  };
}

function computeFreshness(
  opportunity: Opportunity,
  callRows: Call[],
  ticketRows: SupportTicket[],
  health: HealthSnapshot,
  now = new Date(),
): DataFreshness {
  const sources = [
    { name: "salesforce", date: opportunity.sourceUpdatedAt },
    ...callRows.map((c) => ({ name: "gong", date: c.sourceUpdatedAt })),
    ...ticketRows.map((t) => ({ name: "zendesk", date: t.sourceUpdatedAt })),
    { name: "product_analytics", date: health.sourceUpdatedAt },
  ];

  const oldest = sources.reduce(
    (min, s) => (s.date < min ? s.date : min),
    sources[0]?.date ?? now,
  );

  const staleSources = [
    ...new Set(
      sources
        .filter((s) => differenceInDays(now, s.date) > STALE_DAYS)
        .map((s) => s.name),
    ),
  ];

  return { oldestSourceUpdatedAt: oldest, staleSources };
}

export async function getAccounts(): Promise<AccountSummary[]> {
  const db = getDb();
  const rows = await db.select().from(accounts).orderBy(asc(accounts.name));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    industry: row.industry,
    segment: row.segment,
    owner: row.owner,
  }));
}

export async function getAccountContext(
  accountId: string,
): Promise<AccountContext | null> {
  const db = getDb();

  const [accountRow] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);

  if (!accountRow) return null;

  const [opportunityRow] = await db
    .select()
    .from(opportunities)
    .where(eq(opportunities.accountId, accountId))
    .limit(1);

  if (!opportunityRow) return null;

  const callRows = await db
    .select()
    .from(calls)
    .where(eq(calls.accountId, accountId))
    .orderBy(desc(calls.occurredAt));

  const ticketRows = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.accountId, accountId))
    .orderBy(desc(supportTickets.createdAt));

  const [healthRow] = await db
    .select()
    .from(healthSnapshots)
    .where(eq(healthSnapshots.accountId, accountId))
    .limit(1);

  if (!healthRow) return null;

  const opportunity = mapOpportunity(opportunityRow);
  const mappedCalls = callRows.map(mapCall);
  const mappedTickets = ticketRows.map(mapTicket);
  const health = mapHealth(healthRow);

  return {
    account: mapAccount(accountRow),
    opportunity,
    calls: mappedCalls,
    tickets: mappedTickets,
    health,
    freshness: computeFreshness(opportunity, mappedCalls, mappedTickets, health),
  };
}

export { computeFreshness, STALE_DAYS };
