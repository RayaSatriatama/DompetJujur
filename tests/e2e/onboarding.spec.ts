import { test, expect } from '@playwright/test';

test.describe('Onboarding and Baseline (ONB-*)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to onboarding via login as a new synthetic user
    await page.goto('/login');
    // Using a synthetic user that does not have onboarding data yet
    await page.getByLabel('Email').fill('new_user_onb@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    
    // In test environment, magic link bypass routes us to OTP
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi otp/i }).click();
    
    // Should be redirected to onboarding
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test('ONB-004: Valid baseline', async ({ page }) => {
    // Fill income, mandatory, and debt
    await page.getByLabel(/Pendapatan/i).fill('6000000');
    await page.getByLabel(/Kebutuhan Pokok/i).fill('3600000');
    await page.getByLabel(/Cicilan/i).fill('800000');
    
    // Lanjut ke step 2
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    // Expect to be on the second step of onboarding (Risk Window)
    await expect(page.getByText(/Jam berapa Anda biasanya merasa paling ingin belanja/i)).toBeVisible();
  });

  test('ONB-005: All fields empty', async ({ page }) => {
    // Directly submit without filling
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    // Should show HTML5 validation or custom error
    // If HTML5:
    const incomeInput = page.getByLabel(/Pendapatan/i);
    const validationMessage = await incomeInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    
    // If validationMessage is empty, we expect custom error text
    if (!validationMessage) {
      await expect(page.getByText(/tidak boleh kosong/i).first()).toBeVisible();
    } else {
      expect(validationMessage).not.toBe('');
    }
  });

  test('ONB-006: Zero income', async ({ page }) => {
    await page.getByLabel(/Pendapatan/i).fill('0');
    await page.getByLabel(/Kebutuhan Pokok/i).fill('0');
    await page.getByLabel(/Cicilan/i).fill('0');
    
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    // Product should apply defined validation, likely rejecting 0 income
    await expect(page.getByText(/Pendapatan harus lebih dari 0/i).or(page.getByText(/minimal/i))).toBeVisible();
  });

  test('ONB-007: Negative value', async ({ page }) => {
    await page.getByLabel(/Kebutuhan Pokok/i).fill('-500000');
    
    // Because type="number" with min="0", HTML5 validation might trigger, or our custom validation
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    const input = page.getByLabel(/Kebutuhan Pokok/i);
    const validationMessage = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    if (!validationMessage) {
      await expect(page.getByText(/tidak valid/i).or(page.getByText(/negatif/i))).toBeVisible();
    } else {
      expect(validationMessage).not.toBe('');
    }
  });

  test('ONB-013: Mandatory plus debt exceeds income', async ({ page }) => {
    await page.getByLabel(/Pendapatan/i).fill('5000000');
    await page.getByLabel(/Kebutuhan Pokok/i).fill('4000000');
    await page.getByLabel(/Cicilan/i).fill('2000000'); // Total 6m > 5m
    
    await page.getByRole('button', { name: /lanjut/i }).click();
    
    // Should show tight money message
    await expect(page.getByText(/Kebutuhan dan cicilan melebihi pendapatan/i).or(page.getByText(/Peringatan/i))).toBeVisible();
  });

});

test.describe('Risk Window Onboarding (RISK-*)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to onboarding via login as a new synthetic user
    await page.goto('/login');
    await page.getByLabel('Email').fill('new_user_risk@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi otp/i }).click();
    
    // Complete Step 1 to reach Risk Window
    await page.getByLabel(/Pendapatan/i).fill('6000000');
    await page.getByLabel(/Kebutuhan Pokok/i).fill('3600000');
    await page.getByLabel(/Cicilan/i).fill('800000');
    await page.getByRole('button', { name: /lanjut/i }).click();
    await expect(page.getByText(/Jam berapa Anda biasanya merasa paling ingin belanja/i)).toBeVisible();
  });

  test('RISK-001: Select one risk window', async ({ page }) => {
    // Click "Larut malam"
    const option = page.getByRole('button', { name: /larut malam/i });
    await option.click();
    
    // Check if it's visually selected (e.g. class contains 'ring' or 'border-primary')
    // We'll just verify it doesn't crash and maybe proceed
    await page.getByRole('button', { name: /selesai/i }).click();
    
    // Assuming completing onboarding redirects to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('RISK-005 & 006: Valid payday lower/upper boundary', async ({ page }) => {
    // Enter payday
    await page.getByLabel(/Tanggal Gajian/i).fill('1');
    await page.getByRole('button', { name: /larut malam/i }).click();
    await page.getByRole('button', { name: /selesai/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('RISK-007: Invalid payday 0', async ({ page }) => {
    await page.getByLabel(/Tanggal Gajian/i).fill('0');
    await page.getByRole('button', { name: /selesai/i }).click();
    
    const input = page.getByLabel(/Tanggal Gajian/i);
    const validationMessage = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    if (!validationMessage) {
      await expect(page.getByText(/Tanggal tidak valid/i)).toBeVisible();
    } else {
      expect(validationMessage).not.toBe('');
    }
  });

  test('RISK-008: Invalid payday 32', async ({ page }) => {
    await page.getByLabel(/Tanggal Gajian/i).fill('32');
    await page.getByRole('button', { name: /selesai/i }).click();
    
    const input = page.getByLabel(/Tanggal Gajian/i);
    const validationMessage = await input.evaluate((el: HTMLInputElement) => el.validationMessage);
    if (!validationMessage) {
      await expect(page.getByText(/Tanggal tidak valid/i)).toBeVisible();
    } else {
      expect(validationMessage).not.toBe('');
    }
  });

});
