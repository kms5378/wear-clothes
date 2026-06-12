import { expect, test } from "playwright/test";

test("customer can navigate from home to product and mock checkout", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Wear Clothes" })).toBeVisible();
  await page.getByRole("link", { name: /view atelier wool coat/i }).click();
  await expect(page.getByRole("heading", { name: /atelier wool coat/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /create ai try-on/i })).toBeVisible();

  await page.getByRole("link", { name: /cart/i }).click();
  await expect(page.getByRole("heading", { name: /shopping bag/i })).toBeVisible();
  await page.getByRole("link", { name: /continue to checkout/i }).click();
  await expect(page.getByRole("heading", { name: /checkout/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /complete mock payment/i })).toBeVisible();
});
