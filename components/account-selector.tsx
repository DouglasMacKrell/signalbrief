"use client";

import { useRouter } from "next/navigation";

export function AccountSelector({
  accounts,
  currentId,
}: {
  accounts: { id: string; name: string }[];
  currentId: string;
}) {
  const router = useRouter();

  return (
    <select
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      value={currentId}
      onChange={(e) => router.push(`/accounts/${e.target.value}`)}
    >
      {accounts.map((a) => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>
  );
}
