import { test, expect } from '@playwright/test';

test.describe('Accessibility and Responsive UI (A11Y-*)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to root
    await page.goto('/');
  });

  test('A11Y-001 & A11Y-002 & A11Y-003: Keyboard navigation and Focus', async ({ page }) => {
    // Press Tab and expect focus to move to interactive elements
    await page.keyboard.press('Tab');
    
    const focusedHandle = await page.evaluateHandle(() => document.activeElement);
    const tag = await focusedHandle.evaluate(node => node?.tagName.toLowerCase());
    
    // We just expect focus to not be body, but an actual element (e.g., a link or button)
    expect(tag).not.toBe('body');
  });

  test('A11Y-011: Small viewport wrapping', async ({ page }) => {
    // Set viewport to 320x568 (iPhone SE or similar small screen)
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Check if main CTA is visible without horizontal scrolling
    const cta = page.getByRole('link', { name: /mulai/i });
    await expect(cta).toBeVisible();
    
    // Evaluate horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });

});
