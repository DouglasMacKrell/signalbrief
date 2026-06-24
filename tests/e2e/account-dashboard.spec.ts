import { test, expect } from "@playwright/test";

test.describe("Account dashboard", () => {
  test("shows risk signals for Northstar Logistics", async ({ page }) => {
    await page.goto("/accounts/northstar-logistics");

    await expect(page.getByRole("heading", { name: "Northstar Logistics" })).toBeVisible();
    await expect(page.getByText("Risk signals")).toBeVisible();
    await expect(page.getByText("negative", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Show evidence" }).click();
    await expect(page.getByText("high · Payroll tax filing discrepancy for Q1")).toBeVisible();
    await expect(
      page.getByText("High-priority support issue remains unresolved"),
    ).toBeVisible();
    await expect(
      page.getByText("Why this fired: High- or urgent-priority ticket open for more than 7 days"),
    ).toBeVisible();
    await expect(page.getByText("Opportunity may be stalled")).toBeVisible();
  });

  test("shows healthy account with fewer high risks", async ({ page }) => {
    await page.goto("/accounts/acme-creative");

    await expect(page.getByRole("heading", { name: "Acme Creative" })).toBeVisible();
    await expect(page.getByText("No open support tickets")).toBeVisible();
    await expect(page.getByText("positive", { exact: true })).toBeVisible();
    await expect(page.getByText("Product health")).toBeVisible();
    await expect(page.getByText("82")).toBeVisible();
  });

  test("switches accounts from the selector", async ({ page }) => {
    await page.goto("/accounts/acme-creative");

    await Promise.all([
      page.waitForURL(/northstar-logistics/),
      page.getByRole("combobox").selectOption("northstar-logistics"),
    ]);

    await expect(page.getByRole("heading", { name: "Northstar Logistics" })).toBeVisible();
  });
});
