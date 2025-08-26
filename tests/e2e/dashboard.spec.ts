import { test, expect } from '@playwright/test';

test.describe('Dashboard route', () => {
  test('renders dashboard layout and active nav link', async ({ page }) => {
    // ensure desktop viewport so nav text is visible (nav-links uses md:block)
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto('http://localhost:3000/dashboard');

    // heading from app/dashboard/(overview)/page.tsx
    const heading = page.getByRole('heading', { name: 'Dashboard' });
    await expect(heading).toBeVisible();

    // nav link "Home" should be visible and have active classes when on /dashboard
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveClass(/bg-sky-100/);
    await expect(homeLink).toHaveClass(/text-blue-600/);
  });

  test('navigates to Customers when clicking link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/dashboard');

    const customersLink = page.getByRole('link', { name: 'Customers' });
    await expect(customersLink).toBeVisible();
    await customersLink.click();

    // verify navigation occurred (page may render or be not found depending on routes)
    await expect(page).toHaveURL(/\/dashboard\/customers/);
  });
});
