import { describe, expect, it } from "vitest";

import { renderToStaticMarkup } from "react-dom/server";

import { SentimentBadge } from "@/components/sentiment-badge";

describe("SentimentBadge", () => {
  it("renders all call sentiment values", () => {
    for (const sentiment of ["positive", "neutral", "negative"] as const) {
      const html = renderToStaticMarkup(
        <SentimentBadge sentiment={sentiment} />,
      );
      expect(html).toContain(sentiment);
    }
  });
});
