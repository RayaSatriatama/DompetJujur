import { test, expect } from '@playwright/test';

test.describe('AI Reflection & LLM Fallback (AI-*)', () => {

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'e2e-bypass-auth',
        value: 'true',
        url: 'http://localhost:3000',
      }
    ]);
  });

  test('AI-021: AI timeout fallback - static text displayed when LLM stream fails', async ({ page }) => {
    // Intercept the AI endpoint to simulate a timeout/failure
    await page.route('**/api/ai/summary', async route => {
      route.abort('timedout');
    });

    // 1. Go to new pause page
    await page.goto('/pause/new');

    // Wait for amount step heading
    await expect(page.locator('text=/Berapa uang yang lagi kepikiran/i').filter({ visible: true }).first()).toBeVisible();

    // 2. Fill amount (step 1)
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();
    await expect(amountInput).toBeVisible();
    await amountInput.fill('150000');
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();

    // 3. Select trigger & submit step 2
    await page.locator('button:has-text("Lagi stres")').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();

    // 4. Start pause from snapshot page
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+(\/snapshot)?/);
    await page.locator('a:has-text("Mulai jeda")').filter({ visible: true }).first().click();

    // 5. Wait for 90s timer / mock timer to elapse and redirect to decision
    await page.waitForURL(/\/pause\/.*\/decision/, { timeout: 30000 });

    // 6. Choose 'Saya tunda dulu' at decision page
    await page.locator('button:has-text("Saya tunda dulu")').filter({ visible: true }).first().click();

    // 7. At outcome page, choose a reflection option and submit
    await page.locator('input[name="code"]').first().check({ force: true });
    await page.locator('button[type="submit"]').filter({ visible: true }).first().click();

    // 8. Should reach /reflection page
    await page.waitForURL(/\/pause\/.*\/reflection/);

    // 9. Because AI request was aborted, fallback static text must appear (no crash, no infinite spinner)
    await expect(page.getByText(/Catatan untukmu/i)).toBeVisible();
    await expect(page.getByText(/Luar biasa!/i)).toBeVisible();

    // Unroute before navigating away
    await page.unroute('**/api/ai/summary');
    await page.locator('a[href="/home"]').filter({ visible: true }).first().click();
    await page.waitForURL(/\/home/);
  });

});
