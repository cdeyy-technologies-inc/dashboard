import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders home content and login link', async ({ page }) => {
    // Adjust URL if your app uses a different host/port
    await page.goto('http://localhost:3000/');

    // URL and main text
    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.getByText('Welcome to Acme.')).toBeVisible();

    // "Log in" link (accessible role)
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

    // Hero image (desktop alt text; visible at typical desktop viewport)
    await expect(
      page.locator('img[alt="Screenshots of the dashboard project showing desktop version"]')
    ).toBeVisible();
  });
});
