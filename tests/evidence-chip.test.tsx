import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { EvidenceChip } from "@/components/dashboard-ui";

describe("EvidenceChip", () => {
  it("shows human label with source id subtitle", () => {
    const html = renderToStaticMarkup(
      <EvidenceChip
        evidence={{
          sourceSystem: "salesforce",
          sourceId: "006Northstar000Renewal",
          recordType: "opportunity",
          label: "Renewal · $18,000",
        }}
      />,
    );

    expect(html).toContain("Renewal · $18,000");
    expect(html).toContain("salesforce:006Northstar000Renewal");
  });
});
