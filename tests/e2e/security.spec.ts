import { test, expect } from '@playwright/test';

test.describe('Security, RLS, and LLM Mocking (SEC-*, AI-*)', () => {

  test('SEC-019: Session hijack via URL', async ({ page, context }) => {
    // Navigate to a protected route without logging in
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('SEC-020 & SEC-021: Local storage manipulation', async ({ page }) => {
    await page.goto('/login');
    
    // Inject fake token
    await page.evaluate(() => {
      localStorage.setItem('sb-auth-token', 'fake-jwt-token');
    });
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should still redirect to login because the token is invalid on the server
    await expect(page).toHaveURL(/\/login/);
  });

  test('AI-021: AI timeout fallback', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user_ai@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi otp/i }).click();
    
    // Mock the AI endpoint to timeout (abort request after delay)
    await page.route('**/api/ai/summary', async route => {
      // Simulate timeout by aborting
      route.abort('timedout');
    });
    
    // Assume user is at a place where they request AI summary
    await page.goto('/history');
    
    // If there is an AI trigger button
    const aiBtn = page.getByRole('button', { name: /buat dengan ai/i });
    if (await aiBtn.isVisible()) {
      await aiBtn.click();
      
      // Fallback UI should appear instead of crashing
      await expect(page.getByText(/Gagal membuat ringkasan/i).or(page.getByText(/coba lagi/i))).toBeVisible();
    }
  });

});
