import { test, expect } from "@playwright/test";

test.describe("Briefing flow", () => {
  test("generates a rules-fallback briefing", async ({ page }) => {
    await page.goto("/accounts/acme-creative");

    await page.getByRole("button", { name: "Generate Briefing" }).click();
    await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Positive signals")).toBeVisible();
    await expect(page.getByText("Next best action")).toBeVisible();
    await expect(page.getByRole("button", { name: "Helpful", exact: true })).toBeVisible();
  });

  test("captures feedback after briefing", async ({ page }) => {
    await page.goto("/accounts/brightline-health");

    await page.getByRole("button", { name: "Generate Briefing" }).click();
    await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Helpful", exact: true }).click();
    await expect(page.getByText("Thanks — feedback saved.")).toBeVisible();
  });
});
