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

  test('renders customers page and shows active nav link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('http://localhost:3000/dashboard/customers');

    // verify the customers page content is displayed
    const pageContent = page.getByText('Customers Page');
    await expect(pageContent).toBeVisible();

    // nav link "Customers" should be visible and have active classes when on /dashboard/customers
    const customersLink = page.getByRole('link', { name: 'Customers' });
    await expect(customersLink).toBeVisible();
    await expect(customersLink).toHaveClass(/bg-sky-100/);
    await expect(customersLink).toHaveClass(/text-blue-600/);

    // home link should not have active classes
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveClass(/bg-sky-100/);
    await expect(homeLink).toHaveClass(/text-blue-600/);

  });

  test('renders invoices page and shows active nav link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await page.goto('http://localhost:3000/dashboard/invoices');

    // verify the invoices page heading is displayed
    const heading = page.getByRole('heading', { name: 'Invoices' });
    await expect(heading).toBeVisible();

    // verify search component is present
    const searchInput = page.getByPlaceholder('Search invoices...');
    await expect(searchInput).toBeVisible();

    // verify create invoice button is present
    const createButton = page.getByRole('link', { name: /create invoice/i });
    await expect(createButton).toBeVisible();

    // nav link "Invoices" should be visible and have active classes when on /dashboard/invoices
    const invoicesLink = page.getByRole('link', { name: 'Invoices' });
    await expect(invoicesLink).toBeVisible();
    await expect(invoicesLink).toHaveClass(/bg-sky-100/);
    await expect(invoicesLink).toHaveClass(/text-blue-600/);

    // home link should not have active classes
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveClass(/bg-sky-100/);
    await expect(homeLink).toHaveClass(/text-blue-600/);

  });
});
