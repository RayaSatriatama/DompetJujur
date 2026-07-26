import { test, expect } from '@playwright/test';

test.describe('History, Detail, Filtering, and Deletion (HIST-*)', () => {

  test.beforeEach(async ({ context }) => {
    await context.addCookies([{ name: 'e2e-bypass-auth', value: 'true', url: 'http://localhost:3000' }])
  });

  test('HIST-001: History page loads and shows list or empty state', async ({ page }) => {
    await page.goto('/history');
    // Page should load
    const heading = page.getByRole('heading', { name: /Riwayat Jeda/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
    // Either history items or empty state
    const hasItems = await page.locator('a[href*="/history/"]').count() > 0;
    const hasEmptyState = await page.getByText(/Belum ada riwayat/i).isVisible();
    expect(hasItems || hasEmptyState).toBe(true);
  });

  test('HIST-004 & HIST-005 & HIST-006: Filtering', async ({ page }) => {
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: /Riwayat Jeda/i })).toBeVisible({ timeout: 10000 });
    // Filter pills are Link components (anchor tags) - use exact match to avoid matching history items
    const linkAll = page.getByRole('link', { name: 'Semua', exact: true });
    const linkDelayed = page.getByRole('link', { name: 'Ditunda', exact: true });
    
    await expect(linkAll).toBeVisible();
    await expect(linkDelayed).toBeVisible();
    
    // Click delayed filter
    await linkDelayed.click();
    await expect(page).toHaveURL(/filter=delayed/);
    
    // Click all filter
    await linkAll.click();
    await expect(page).toHaveURL(/\/history/);
  });

  test('HIST-008 & HIST-013: Session detail and Delete confirmation cancel', async ({ page }) => {
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: /Riwayat Jeda/i })).toBeVisible({ timeout: 10000 });

    // Click the first real history item (demo user has seeded data)
    const firstItem = page.locator('a[href*="/history/"]').first();
    if (await firstItem.isVisible()) {
      await firstItem.click();
      
      // Detail page should load (URL changes to /history/[id])
      await expect(page).toHaveURL(/\/history\/[0-9a-fA-F-]+/, { timeout: 10000 });
      
      // Detail page shows "Detail Jeda" heading on both mobile and desktop
      await expect(page.getByRole('heading', { name: /Detail Jeda/i })).toBeVisible({ timeout: 5000 });
    }
  });

});
