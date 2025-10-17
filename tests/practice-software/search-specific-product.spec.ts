// spec: tests/plans/search-specific-product-practice-software-testing-concrete.md

import { test, expect } from '@playwright/test';

test.describe('Test scenario: Search for a specific product', () => {
  test('Search — Find "Combination Pliers"', async ({ page }) => {
    // 1. Navigate to https://practicesoftwaretesting.com
    await page.goto('https://practicesoftwaretesting.com');

    // 2. Locate the search textbox by accessible name 'Search'
    const searchBox = page.getByRole('textbox', { name: 'Search' });
    await expect(searchBox).toBeVisible();

    // 3. Fill 'Combination Pliers'
    await searchBox.fill('Combination Pliers');

    // 4. Submit the search (press Enter)
    await searchBox.press('Enter');

    // 5. Wait for the product link 'Combination Pliers' to appear
    const productLink = page.getByRole('link', { name: /^Combination Pliers/i });
    await expect(productLink).toBeVisible({ timeout: 5000 });

    // 6. Verify the link is visible and href starts with /product/
    const href = await productLink.getAttribute('href');
    expect(href).toMatch(/^\/product\//);

    // 7. (Optional) Click product link and verify navigation to product page
    await productLink.click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByRole('heading', { name: /^Combination Pliers/i })).toBeVisible();
  });
});
