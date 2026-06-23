import { test, expect } from "@playwright/test";

test.describe("SignalBrief home", () => {
  test("lists five demo accounts", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Account intelligence" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Acme Creative" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Northstar Logistics" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Brightline Health Clinic" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Summit Legal Partners" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Harbor Foods Co-op" })).toBeVisible();
  });
});
