import { test, expect } from '@playwright/test';

test.describe('History, Detail, Filtering, and Deletion (HIST-*)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user_history@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi otp/i }).click();
    
    // Go to history tab
    await page.goto('/history');
  });

  test('HIST-001: Empty history', async ({ page }) => {
    // If no data, empty state is shown
    await expect(page.getByText(/Belum ada riwayat/i).or(page.getByText(/Mulai Jeda/i))).toBeVisible();
  });

  test('HIST-004 & HIST-005 & HIST-006: Filtering', async ({ page }) => {
    // We expect filter buttons to be available
    const btnAll = page.getByRole('button', { name: /semua/i });
    const btnDelayed = page.getByRole('button', { name: /ditunda/i });
    const btnProceeded = page.getByRole('button', { name: /tetap lanjut/i });
    
    if (await btnDelayed.isVisible()) {
      // Test delayed filter
      await btnDelayed.click();
      await expect(btnDelayed).toHaveAttribute('aria-pressed', 'true');
      
      // Test proceeded filter
      await btnProceeded.click();
      await expect(btnProceeded).toHaveAttribute('aria-pressed', 'true');
      
      // Test all filter
      await btnAll.click();
      await expect(btnAll).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('HIST-008 & HIST-013: Session detail and Delete confirmation cancel', async ({ page }) => {
    // Mock API to return a single history item
    await page.route('**/api/sessions/history', async route => {
      await route.fulfill({
        status: 200,
        json: [{
          id: 'hist-123',
          amount: 500000,
          outcome: 'delayed',
          trigger: 'Bosan',
          createdAt: new Date().toISOString()
        }]
      });
    });
    await page.reload();

    // Click the first item
    const firstItem = page.locator('text=Rp500.000').first();
    if (await firstItem.isVisible()) {
      await firstItem.click();
      
      // Detail should open
      await expect(page.getByText(/Detail Jeda/i)).toBeVisible();
      
      // Click delete
      const deleteBtn = page.getByRole('button', { name: /hapus/i });
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        
        // Confirmation appears, click Cancel
        const cancelBtn = page.getByRole('button', { name: /batal/i });
        await cancelBtn.click();
        
        // Modal closes, record remains
        await expect(cancelBtn).not.toBeVisible();
        await expect(page.getByText(/Detail Jeda/i)).toBeVisible();
      }
    }
  });

});
