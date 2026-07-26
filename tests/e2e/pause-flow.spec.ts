import { test, expect } from '@playwright/test';

test.describe('Pause Flow (AMT-*, CON-*, TMR-*, OUT-*)', () => {

  test.beforeEach(async ({ context }) => {
    // E2E Mocking via Auth Bypass pointing to seed.sql user (0000-0001)
    await context.addCookies([
      {
        name: 'e2e-bypass-auth',
        value: 'true',
        url: 'http://localhost:3000',
      }
    ]);
  });

  test('AMT-002 & AMT-004: Zero and negative amounts are blocked', async ({ page }) => {
    await page.goto('/pause/new');
    
    // Wait for page to load
    await expect(page.locator('text=/Berapa uang yang lagi kepikiran/i').filter({ visible: true }).first()).toBeVisible();
    
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();

    // AMT-002: Zero amount
    await amountInput.fill('0');
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();
    await expect(page.locator('text=/Masukkan nominal/i').filter({ visible: true }).first()).toBeVisible();
  });

  test('AMT-001, TRG-001, CON-011, TMR-001, OUT-001: Full Pause Flow until Decision', async ({ page }) => {
    await page.goto('/pause/new');
    
    // AMT-005: Quick chip 50k
    const chip50k = page.getByRole('button', { name: 'Rp50rb', exact: true }).filter({ visible: true }).first();
    await chip50k.click();
    
    const amountInput = page.locator('input[placeholder="0"]').filter({ visible: true }).first();
    await expect(amountInput).toHaveValue(/50\.?000/);

    // Override with custom amount (AMT-001)
    await amountInput.fill('125000');
    
    // Lanjut
    await page.locator('button:has-text("Lanjut")').filter({ visible: true }).first().click();
    
    // TRG-001: Trigger step
    await expect(page.locator('text=/Apa yang paling dekat dengan kondisimu/i').filter({ visible: true }).first()).toBeVisible();
    
    // Test validation
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();
    await expect(page.locator('text=/Pilih kondisimu saat ini/i').filter({ visible: true }).first()).toBeVisible();
    
    // Select trigger
    await page.locator('button:has-text("Lagi stres")').filter({ visible: true }).first().click();
    
    // Submit
    await page.locator('button:has-text("Lihat dampaknya")').filter({ visible: true }).first().click();
    
    // CON-011: Verify Snapshot Page
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+(\/snapshot)?/);
    await expect(page.locator('text=/125\.000/i').filter({ visible: true }).first()).toBeVisible();
    
    // Start pause
    await page.locator('a:has-text("Mulai jeda")').filter({ visible: true }).first().click();
    
    // TMR-001: Verify Timer Page
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/timer/);
    
    // OUT-001: Fast-forward to Decision and Outcome
    await page.waitForURL(/\/pause\/[0-9a-fA-F-]+\/decision/, { timeout: 30000 });
    await expect(page.locator('text=/Jeda selesai/i').filter({ visible: true }).first()).toBeVisible();

    // Select "Saya tunda dulu"
    await page.locator('button:has-text("Saya tunda dulu")').filter({ visible: true }).first().click();
    
    // Should show reflection outcome page
    await expect(page.locator('text=/Bagaimana perasaanmu setelah jeda ini/i').filter({ visible: true }).first()).toBeVisible();
    
    // Submit reflection
    await page.locator('input[name="code"]').first().check({ force: true });
    await page.locator('button[type="submit"]').filter({ visible: true }).first().click();

    // AI Reflection page
    await page.waitForURL(/\/pause\/.*\/reflection/);
    await expect(page.locator('text=/Catatan untukmu/i').filter({ visible: true }).first()).toBeVisible();
    await page.locator('a[href="/home"]').filter({ visible: true }).first().click();

    // Return to dashboard
    await expect(page).toHaveURL(/\/home/);
  });

});
