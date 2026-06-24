import type { SupportTicket } from "@/src/domain/types";

export function isOpenSupportTicket(ticket: SupportTicket): boolean {
  return ticket.status === "open" || ticket.status === "pending";
}

export function partitionSupportTickets(tickets: SupportTicket[]): {
  open: SupportTicket[];
  resolved: SupportTicket[];
} {
  const open: SupportTicket[] = [];
  const resolved: SupportTicket[] = [];

  for (const ticket of tickets) {
    if (isOpenSupportTicket(ticket)) {
      open.push(ticket);
    } else {
      resolved.push(ticket);
    }
  }

  return { open, resolved };
}
