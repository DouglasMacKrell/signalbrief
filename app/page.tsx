import { AccountPreviewCard } from "@/components/account-preview-card";
import { AgentLayerCallout } from "@/components/agent-layer-callout";
import { getAccountPreviews } from "@/src/domain/account-preview";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const previews = await getAccountPreviews();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              SignalBrief
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Account intelligence
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Evidence-backed account intelligence for revenue teams. Select a demo
          account to view unified CRM, call, support, and product health data.
        </p>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((preview) => (
            <AccountPreviewCard key={preview.id} preview={preview} />
          ))}
        </div>

        {previews.length === 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No accounts found. Run{" "}
            <code className="font-mono">npm run db:migrate && npm run db:seed</code>.
          </p>
        )}

        <AgentLayerCallout />
      </main>
    </div>
  );
}
