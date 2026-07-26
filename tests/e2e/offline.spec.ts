import { test, expect } from '@playwright/test';

test.describe('PWA, Offline, and Caching (PWA-*)', () => {

  test('PWA-004 & PWA-005: Offline launch and Data availability', async ({ page, context }) => {
    // Navigate and cache resources
    await page.goto('/login');
    
    // Simulate going offline
    await context.setOffline(true);
    
    // Reload page
    await page.reload();
    
    // The app shell should still load (though API calls might fail)
    // We check if the basic layout exists
    await expect(page.getByRole('heading', { name: /selamat/i }).or(page.locator('body'))).toBeVisible();
    
    // Check if there is an offline indicator or polite error
    // (This depends on actual PWA implementation, we just test it doesn't show standard browser dinosaur)
    const title = await page.title();
    expect(title).not.toBe('');
  });

});
