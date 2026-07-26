import { test, expect } from '@playwright/test';

test.describe('Pause Flow (AMT-*, CON-*, TMR-*, OUT-*)', () => {

  test.beforeEach(async ({ page }) => {
    // Seeded user login
    await page.goto('/login');
    await page.getByLabel('Email').fill('user_pause@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi masuk/i }).click();
    
    // Go to input amount step from Dashboard
    await page.goto('/pause/amount');
  });

  test('AMT-001 & AMT-005 & AMT-012: Valid amount, Quick chip, Cancel', async ({ page }) => {
    // AMT-012: Cancel amount
    const cancelBtn = page.getByRole('link', { name: /batal/i });
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await expect(page).toHaveURL(/\/dashboard/);
      await page.goto('/pause/amount');
    }

    // AMT-005: Quick chip 50k
    const chip50k = page.getByRole('button', { name: /50rb/i });
    if (await chip50k.isVisible()) {
      await chip50k.click();
      const amountInput = page.getByLabel(/Nominal/i);
      await expect(amountInput).toHaveValue(/50\.?000/);
    } else {
      // AMT-001: Valid amount fallback
      await page.getByLabel(/Nominal/i).fill('350000');
    }
    
    // Continue to trigger step or consequence
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    // Should proceed to consequence / trigger page
    await expect(page).not.toHaveURL(/\/pause\/amount/);
  });

  test('AMT-002 & AMT-004: Zero and negative amounts', async ({ page }) => {
    const input = page.getByLabel(/Nominal/i);
    
    // AMT-002: Zero amount
    await input.fill('0');
    await page.getByRole('button', { name: /lanjut/i }).click();
    await expect(page.getByText(/lebih dari Rp0/i).or(page.getByText(/tidak valid/i))).toBeVisible();
    
    // AMT-004: Negative amount
    await input.fill('-50000');
    await page.getByRole('button', { name: /lanjut/i }).click();
    await expect(page.getByText(/tidak valid/i).or(page.getByText(/negatif/i))).toBeVisible();
  });

  test('CON-001 & CON-011 & TMR-001: Snapshot and Start Timer', async ({ page }) => {
    // Fill amount and proceed to Snapshot
    await page.getByLabel(/Nominal/i).fill('350000');
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    // Assume we're on Consequence Snapshot
    await expect(page.getByText(/Rp350.000/)).toBeVisible();
    
    // CON-011: Start Pause
    const startPauseBtn = page.getByRole('button', { name: /mulai jeda/i });
    await expect(startPauseBtn).toBeVisible();
    
    // We mock the API to return a 90 seconds timer
    await page.route('**/api/pause/start', async route => {
      await route.fulfill({ status: 200, json: { sessionId: 'test-session-123', endsAt: Date.now() + 90000 } });
    });
    
    await startPauseBtn.click();
    
    // Should navigate to timer page
    await expect(page).toHaveURL(/\/pause\/timer/);
    
    // TMR-001: Timer UI appears
    await expect(page.getByText(/menit/i).or(page.getByText(/detik/i))).toBeVisible();
  });

  test('OUT-001 & OUT-012: Delayed outcome and Skip reflection', async ({ page }) => {
    // Mock directly arriving at decision step
    await page.route('**/api/pause/status', async route => {
      await route.fulfill({ status: 200, json: { status: 'decision' } });
    });
    await page.goto('/pause/decision');
    
    // Select Delayed
    await page.getByRole('button', { name: /saya tunda dulu/i }).click();
    
    // Should show reflection
    await expect(page.getByText(/Bagaimana perasaanmu sekarang/i)).toBeVisible();
    
    // Skip reflection
    await page.getByRole('button', { name: /lewati/i }).click();
    
    // Return to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

});
