import Link from "next/link";

import { getAccounts } from "@/src/domain/account-context";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const accounts = await getAccounts();

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

        <div className="grid gap-4 sm:grid-cols-2">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/accounts/${account.id}`}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600"
            >
              <h2 className="text-lg font-semibold">{account.name}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {account.industry} · {account.segment}
              </p>
              <p className="mt-3 text-sm">Owner: {account.owner}</p>
            </Link>
          ))}
        </div>

        {accounts.length === 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No accounts found. Run{" "}
            <code className="font-mono">npm run db:migrate && npm run db:seed</code>.
          </p>
        )}
      </main>
    </div>
  );
}
