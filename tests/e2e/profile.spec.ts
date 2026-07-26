import { test, expect } from '@playwright/test';

test.describe('Profile, Privacy, Export, and Deletion (PRIV-*)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user_profile@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi masuk/i }).click();
    
    // Assume user is onboarded. Go to Profile directly
    await page.goto('/profile');
  });

  test('PRIV-001: Profile display', async ({ page }) => {
    // Should display identity
    await expect(page.getByText('user_profile@test.local')).toBeVisible();
    await expect(page.getByRole('heading', { name: /profil/i })).toBeVisible();
  });

  test('PRIV-002: Update payday', async ({ page }) => {
    // Mock update profile
    await page.route('**/api/profile', async route => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    const paydayInput = page.getByLabel(/Tanggal Gajian/i);
    await paydayInput.fill('25');
    await page.getByRole('button', { name: /simpan/i }).click();
    
    // Expect success message
    await expect(page.getByText(/Berhasil disimpan/i)).toBeVisible();
  });

  test('PRIV-004: Privacy statement', async ({ page }) => {
    // Privacy policy or statement should exist
    const privacyLink = page.getByRole('link', { name: /privasi/i });
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await expect(page).toHaveURL(/\/privacy/);
    }
    
    await expect(page.getByText(/kami tidak pernah meminta akses bank/i)).toBeVisible();
  });

  test('PRIV-006: Export request', async ({ page }) => {
    // Should have export button
    const exportBtn = page.getByRole('button', { name: /ekspor data/i });
    await expect(exportBtn).toBeVisible();
    
    // Mock export download
    await page.route('**/api/export', async route => {
      await route.fulfill({ 
        status: 200, 
        contentType: 'text/csv', 
        body: 'id,amount\n1,500000' 
      });
    });

    // Handle download event
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      exportBtn.click()
    ]);
    
    // Should trigger a download successfully
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('PRIV-010 & PRIV-013: Delete-history confirmation and cancel', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /hapus riwayat/i });
    await deleteBtn.click();
    
    // Irreversible warning should appear
    const warningText = page.getByText(/Tindakan ini tidak dapat dibatalkan/i);
    await expect(warningText).toBeVisible();
    
    // Click Cancel
    const cancelBtn = page.getByRole('button', { name: /batal/i });
    await cancelBtn.click();
    
    // Warning should disappear
    await expect(warningText).not.toBeVisible();
  });

});
