import type { Call } from "@/src/domain/types";

const sentimentStyles: Record<
  Call["sentiment"],
  string
> = {
  positive:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  neutral:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  negative:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

export function SentimentBadge({
  sentiment,
}: {
  sentiment: Call["sentiment"];
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${sentimentStyles[sentiment]}`}
    >
      {sentiment}
    </span>
  );
}
