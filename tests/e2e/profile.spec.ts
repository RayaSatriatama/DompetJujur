import { test, expect } from '@playwright/test';

test.describe('Profile, Privacy, Export, and Deletion (PRIV-*)', () => {

  test.beforeEach(async ({ context }) => {
    await context.addCookies([{ name: 'e2e-bypass-auth', value: 'true', url: 'http://localhost:3000' }])
  });

  test('PRIV-001: Profile display', async ({ page }) => {
    await page.goto('/profile');
    // Should display identity
    await expect(page.getByText('demo@example.com')).toBeVisible();
    await expect(page.getByRole('heading', { name: /saya/i })).toBeVisible();
  });

  test('PRIV-002: Update payday', async ({ page }) => {
    await page.goto('/plan');
    // Mock update profile
    await page.route('**/api/profile', async route => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    const paydayInput = page.locator('select:visible').first();
    await paydayInput.selectOption('25');
    await page.locator('button:has-text("Selesai"):visible').first().click();
    
    // Expect redirect or success (payday updated)
    // Plan page redirects to /home on submit
    await page.waitForURL(/\/home/, { timeout: 15000 });
  });

  test('PRIV-004: Privacy statement', async ({ page }) => {
    // Privacy statement is on the /profile/privacy page
    await page.goto('/profile/privacy');
    await expect(page.getByText(/tidak membutuhkan akses rekening bank/i)).toBeVisible({ timeout: 10000 });
  });


  test('PRIV-006: Export request', async ({ page }) => {
    await page.goto('/profile/privacy');
    // Should have export button
    const exportBtn = page.getByRole('button', { name: /unduh data/i });
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
    
    // Button should be clickable (it triggers alert in current implementation)
    page.on('dialog', dialog => dialog.dismiss());
    await exportBtn.click();
    // Just verifying no crash and button still exists after click
    await expect(exportBtn).toBeVisible();
  });

  test('PRIV-010 & PRIV-013: Delete-history confirmation and cancel', async ({ page }) => {
    await page.goto('/profile/privacy');
    const deleteBtn = page.getByRole('button', { name: /hapus riwayat/i });
    await deleteBtn.click();
    
    // Irreversible warning should appear
    const warningText = page.getByText(/tidak bisa dikembalikan/i);
    await expect(warningText).toBeVisible();
    
    // Click Cancel
    const cancelBtn = page.getByRole('button', { name: /batal/i });
    await cancelBtn.click();
    
    // Warning should disappear
    await expect(warningText).not.toBeVisible();
  });

});
