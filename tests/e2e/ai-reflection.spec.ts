import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

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

  /**
   * AI-020: Verify the AI endpoint is actually called and its streamed text is rendered.
   */
  test('AI-020: Successful AI streaming completion - AI text is called and rendered', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    
    await page.route('**/api/ai/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: 'Hebat sekali kamu berhasil mengambil jeda hari ini! Tetap semangat ya.',
      });
    });

    // 1. Start pause flow
    await page.goto('/pause/new');
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();
    await amountInput.fill('150000');
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();

    // 2. Select trigger and proceed to snapshot
    await page.locator('button:has-text("Lagi stres")').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();

    // 3. Snapshot -> start timer
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+(\/snapshot)?/, { timeout: 30000 });
    await page.locator('a:has-text("Mulai jeda")').filter({ visible: true }).first().click();

    // 4. Wait for decision page
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/decision/, { timeout: 30000 });
    
    // Add a delay to ensure server time considers the timer as completed
    await page.waitForTimeout(2000);

    // 5. Click "Saya tunda dulu"
    await page.locator('button:has-text("Saya tunda dulu")').filter({ visible: true }).first().click();

    // 6. Wait for outcome page and select reflection code
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/outcome/, { timeout: 30000 });
    await page.locator('input[name="code"]').first().check({ force: true });
    await page.locator('button[type="submit"]').filter({ visible: true }).first().click();

    // 7. Wait for reflection page load (AI mock will be fetched)
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/reflection/, { timeout: 30000 });

    // 8. The mocked AI text must appear on screen
    await expect(page.getByText(/Hebat sekali kamu berhasil/i)).toBeVisible({ timeout: 10000 });
  });

  /**
   * AI-021: When the LLM stream fails, the component must show the fallback static text.
   */
  test('AI-021: AI timeout fallback - static text displayed when LLM stream fails', async ({ page }) => {
    // Simulate a hard network failure on the AI endpoint
    await page.route('**/api/ai/summary', async route => {
      await route.abort('timedout');
    });

    // 1. Start pause flow
    await page.goto('/pause/new');
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();
    await amountInput.fill('150000');
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();

    // 2. Select trigger -> snapshot
    await page.locator('button:has-text("Lagi stres")').filter({ visible: true }).first().click();
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();

    // 3. Start timer
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+(\/snapshot)?/, { timeout: 30000 });
    await page.locator('a:has-text("Mulai jeda")').filter({ visible: true }).first().click();

    // 4. Wait for decision page
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/decision/, { timeout: 30000 });
    
    // Add a delay to ensure server time considers the timer as completed
    await page.waitForTimeout(2000);

    // 5. Delayed outcome
    await page.locator('button:has-text("Saya tunda dulu")').filter({ visible: true }).first().click();

    // 6. Outcome page - select reflection code
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/outcome/, { timeout: 30000 });
    await page.locator('input[name="code"]').first().check({ force: true });
    await page.locator('button[type="submit"]').filter({ visible: true }).first().click();

    // 7. Wait for reflection page load
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/reflection/, { timeout: 30000 });

    // 8. The fallback static text must appear (no crash, no infinite spinner)
    await expect(page.locator('text=/Catatan untukmu/i').filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
  });

});
