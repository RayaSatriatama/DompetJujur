import { test, expect } from '@playwright/test';

// Note: To test authenticated routes, we normally use storage state or mock the auth session.
// For now, we will test the UI of the public landing page or mock the login state.

test.describe('Home and Navigation', () => {
  test('Should show welcome page for unauthenticated users', async ({ page }) => {
    // If we go to root, it should redirect to login
    await page.goto('/');
    expect(page.url()).toContain('/login');
    
    // Check if login form is present
    await expect(page.getByRole('button', { name: /masuk|login/i })).toBeVisible();
  });
});
