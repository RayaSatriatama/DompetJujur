import { test, expect } from '@playwright/test';

test.describe('Authentication (AUTH-*)', () => {
  test('AUTH-001: Valid magic-link request', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the email input
    await page.fill('input[type="email"]', 'user_a@test.local');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show success state/confirmation
    await expect(page.getByText('Cek Email Kamu')).toBeVisible({ timeout: 10000 });
  });

  test('AUTH-002: Empty email', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Built-in HTML5 validation should prevent submission, or show a required message
    const emailInput = page.locator('input[type="email"]');
    
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
