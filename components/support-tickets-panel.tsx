import { formatRelative } from "@/components/dashboard-ui";
import { partitionSupportTickets } from "@/src/domain/support-tickets";
import type { SupportTicket } from "@/src/domain/types";

function TicketRow({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 text-sm dark:border-slate-800">
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
  );
}

export function SupportTicketsPanel({
  tickets,
}: {
  tickets: SupportTicket[];
}) {
  const { open, resolved } = partitionSupportTickets(tickets);

  return (
    <div className="space-y-5">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Open
        </h3>
        {open.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No open support tickets</p>
        ) : (
          <div className="mt-2 space-y-3">
            {open.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {resolved.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Resolved
          </h3>
          <div className="mt-2 space-y-3 opacity-80">
            {resolved.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
