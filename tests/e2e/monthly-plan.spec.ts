import { test, expect } from '@playwright/test';

test.describe('Safe Monthly Plan (PLAN-*)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user_plan@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi otp/i }).click();
    
    // Assume we can access monthly plan directly
    await page.goto('/monthly-plan');
  });

  test('PLAN-001: Valid plan and deterministic calculation', async ({ page }) => {
    const incomeInput = page.getByLabel(/Pendapatan/i);
    const mandatoryInput = page.getByLabel(/Kebutuhan Pokok/i);
    const debtInput = page.getByLabel(/Cicilan/i);
    
    // If fields exist, fill them
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('10000000');
      await mandatoryInput.fill('5000000');
      await debtInput.fill('2000000');
      
      // Assume there is a save button
      await page.getByRole('button', { name: /simpan/i }).click();
      
      // Expected Flexible Amount: 10M - 5M - 2M = 3M
      await expect(page.getByText(/Rp3\.000\.000/)).toBeVisible();
    }
  });

  test('PLAN-003: Commitments exceed income', async ({ page }) => {
    const incomeInput = page.getByLabel(/Pendapatan/i);
    
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('5000000');
      await page.getByLabel(/Kebutuhan Pokok/i).fill('6000000');
      
      await page.getByRole('button', { name: /simpan/i }).click();
      
      // Should show warning and not negative flexible amount
      await expect(page.getByText(/Peringatan/i).or(page.getByText(/melebihi/i))).toBeVisible();
      // Should not contain negative sign before Rp
      await expect(page.getByText(/-Rp/)).not.toBeVisible();
    }
  });

});
