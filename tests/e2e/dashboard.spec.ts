import { test, expect } from '@playwright/test';

test.describe('Dashboard and Aggregations (DASH-*, HOME-*)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard as a seeded user
    // (In a real test, we'd use a special seeded user or mock the API)
    await page.goto('/login');
    await page.getByLabel('Email').fill('user_dashboard@test.local');
    await page.getByRole('button', { name: /kirim tautan/i }).click();
    await page.getByLabel('Kode OTP').fill('123456');
    await page.getByRole('button', { name: /verifikasi masuk/i }).click();
    
    // Assume this user already completed onboarding
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('HOME-001 & DASH-001: Empty Dashboard State', async ({ page }) => {
    // If user has no sessions, calm empty state copy appears
    await expect(page.getByText(/Belum ada data/i).or(page.getByText(/Mulai catat jeda pertamamu/i))).toBeVisible();
    
    // No fabricated insight or chart appears
    await expect(page.locator('canvas, svg.chart-container')).not.toBeVisible();
  });

  test('HOME-007: Bottom navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Testing bottom nav applies mainly to mobile viewports');
    
    // We expect 3 tabs: Beranda (Home), Riwayat (History), Profil (Profile)
    const navBeranda = page.getByRole('link', { name: /beranda/i });
    const navRiwayat = page.getByRole('link', { name: /riwayat/i });
    const navProfil = page.getByRole('link', { name: /profil/i });

    await expect(navBeranda).toBeVisible();
    
    await navRiwayat.click();
    await expect(page).toHaveURL(/\/history/);
    
    await navProfil.click();
    await expect(page).toHaveURL(/\/profile/);
    
    await navBeranda.click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('DASH-002 & DASH-003: Session count and Delayed count', async ({ page }) => {
    // Mocking API for sessions
    await page.route('**/api/sessions/aggregate', async route => {
      const json = {
        totalSessions: 8,
        delayedSessions: 5,
        delayedNominal: 1500000,
        topTrigger: 'Bosan'
      };
      await route.fulfill({ json });
    });

    await page.reload();

    // Check assertions
    await expect(page.getByText('8')).toBeVisible(); // Total Sessions
    await expect(page.getByText('5')).toBeVisible(); // Delayed Sessions
    await expect(page.getByText(/Rp1\.500\.000/)).toBeVisible(); // Delayed nominal sum
  });

  test('DASH-006: Top trigger', async ({ page }) => {
    await page.route('**/api/sessions/aggregate', async route => {
      const json = {
        totalSessions: 10,
        delayedSessions: 8,
        delayedNominal: 500000,
        topTrigger: 'Stres'
      };
      await route.fulfill({ json });
    });

    await page.reload();

    // Wait for the "Stres" text to be visible as top trigger
    await expect(page.getByText(/Stres/i)).toBeVisible();
  });

});
