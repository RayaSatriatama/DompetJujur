import { test, expect } from '@playwright/test';

test.describe('Authentication (AUTH-*)', () => {
  test('AUTH-001: Valid magic-link request', async ({ page }) => {
    await page.goto('/login');
    
    // Use accessible locator
    await page.getByLabel('Email').fill('user_a@test.local');
    
    // Submit the form
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    
    // Should show success state/confirmation
    await expect(page.getByText(/cek email kamu/i)).toBeVisible({ timeout: 15000 });
  });

  test('AUTH-002: Empty email', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    
    // Built-in HTML5 validation should prevent submission, or show a required message
    const emailInput = page.getByLabel('Email');
    
    // Playwright evaluates HTML5 validation
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });

  test('AUTH-007: Protected route without session', async ({ page }) => {
    // Try to access protected route without login
    const response = await page.goto('/home');
    
    // It should redirect to /login or /welcome
    expect(page.url()).toContain('/login');
  });
});
