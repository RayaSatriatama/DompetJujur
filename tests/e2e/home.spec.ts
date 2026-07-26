import { test, expect } from '@playwright/test';

test.describe('Home and Navigation', () => {
  test('Should show welcome page for unauthenticated users', async ({ page }) => {
    // If we go to root, it should show the landing/welcome page
    await page.goto('/');
    
    // The page URL should just be the base URL or /
    // Check for the "Mulai" button
    await expect(page.getByRole('link', { name: /mulai/i }).first()).toBeVisible({ timeout: 15000 });
  });
});


