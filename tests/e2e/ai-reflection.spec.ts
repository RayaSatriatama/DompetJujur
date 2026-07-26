import { test, expect } from '@playwright/test';

test.describe('AI Reflection & LLM Integration (AI-*)', () => {

  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'e2e-bypass-auth',
        value: 'true',
        url: 'http://localhost:3000',
      }
    ]);
  });

  test('AI-020: Successful AI streaming completion - AI text is called and rendered', async ({ page }) => {
    // Intercept the AI endpoint to return a mock AI streaming response in Vercel AI SDK format
    await page.route('**/api/ai/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: '0:"Hebat sekali kamu berhasil mengambil jeda hari ini! Tetap semangat ya."\n',
      });
    });

    // 1. Go to new pause page
    await page.goto('/pause/new');

    // 2. Fill amount
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();
    await amountInput.fill('150000');
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();

    // 3. Select trigger
    await page.locator('button:has-text("Lagi stres")').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();

    // 4. Extract session ID from snapshot URL
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+(\/snapshot)?/);
    const sessionUrl = page.url();
    const sessionId = sessionUrl.split('/pause/')[1].split('/')[0];

    // Navigate to reflection page directly
    await page.goto(`/pause/${sessionId}/reflection`);

    // 5. Verify the AI response text is streamed and displayed on screen
    await expect(page.locator('text=/Hebat sekali kamu berhasil/i').filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('AI-021: AI timeout fallback - static text displayed when LLM stream fails', async ({ page }) => {
    // Intercept the AI endpoint to simulate a timeout/failure
    await page.route('**/api/ai/summary', async route => {
      await route.abort('timedout');
    });

    // 1. Go to new pause page
    await page.goto('/pause/new');

    // 2. Fill amount
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();
    await amountInput.fill('150000');
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();

    // 3. Select trigger
    await page.locator('button:has-text("Lagi stres")').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();

    // 4. Extract session ID
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+(\/snapshot)?/);
    const sessionUrl = page.url();
    const sessionId = sessionUrl.split('/pause/')[1].split('/')[0];

    // Navigate to reflection page
    await page.goto(`/pause/${sessionId}/reflection`);

    // 5. Because AI request was aborted, fallback static text must appear
    await expect(page.locator('text=/Catatan untukmu/i').filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
  });

});
