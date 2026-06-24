import { describe, expect, it } from "vitest";

import {
  isOpenSupportTicket,
  partitionSupportTickets,
} from "@/src/domain/support-tickets";
import type { SupportTicket } from "@/src/domain/types";

function ticket(
  status: SupportTicket["status"],
  id = "ticket-1",
): SupportTicket {
  return {
    id,
    accountId: "acme-creative",
    priority: "normal",
    status,
    createdAt: new Date(),
    summary: "Test ticket",
    sourceSystem: "zendesk",
    sourceId: "zendesk:test",
    sourceUpdatedAt: new Date(),
  };
}

describe("support ticket partitioning", () => {
  it("treats open and pending as open tickets", () => {
    expect(isOpenSupportTicket(ticket("open"))).toBe(true);
    expect(isOpenSupportTicket(ticket("pending"))).toBe(true);
    expect(isOpenSupportTicket(ticket("solved"))).toBe(false);
  });

  it("partitions tickets into open and resolved groups", () => {
    const { open, resolved } = partitionSupportTickets([
      ticket("open", "open-1"),
      ticket("pending", "pending-1"),
      ticket("solved", "solved-1"),
    ]);

    expect(open.map((t) => t.id)).toEqual(["open-1", "pending-1"]);
    expect(resolved.map((t) => t.id)).toEqual(["solved-1"]);
  });
});
