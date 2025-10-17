# Search Specific Product — Practice Software Testing (Concrete)

## Summary
Concrete test plan to verify that the Practice Software Testing demo site can find a specific product using the search feature. This file uses selectors discovered from a live exploration of the site and a concrete product example.

## Discovery notes
- Site: https://practicesoftwaretesting.com (title: Practice Software Testing - Toolshop - v5.0)
- Sidebar search area provides a labelled textbox "Search" and a "Search" button.
- Product items appear as links with titles (e.g., Combination Pliers) and product URLs follow `/product/<id>`.
- Pagination is present on the product list.

## Test scenario: Search for a specific product

Title: Search — Find "Combination Pliers"

Starting state: fresh browser context, user not logged in, landed on https://practicesoftwaretesting.com

Steps:
1. Navigate to `https://practicesoftwaretesting.com`.
2. Locate the search input field by accessible name: `page.getByRole('textbox', { name: 'Search' })`.
3. Click/focus the search input.
4. Type the text: `Combination Pliers`.
5. Submit the search by pressing Enter or clicking the search button: `page.getByRole('button', { name: 'Search' }).click()`.
6. Wait up to 5 seconds for the product link titled "Combination Pliers" to appear in the results.
7. Verify that the product link is visible and that its `href` attribute starts with `/product/`.
8. Optionally click the link and validate navigation to the product detail page (URL includes `/product/` and a heading for the product is visible).

Expected results:
- A result with the visible title "Combination Pliers" is present within 5 seconds.
- The product link points to a `/product/` URL pattern.
- No uncaught JavaScript errors are surfaced to the user.

Success criteria:
- Test passes when the product link is found and validates the `href` pattern within the timeout.

Failure conditions:
- Search input/button not available or not interactive.
- No matching product found.
- Server error returned (500/404) while searching.

## Playwright example (copy-paste ready)
Replace or adjust selectors if the UI changes.

```ts
import { test, expect } from '@playwright/test';

test('Search — Find Combination Pliers', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com');
  await page.waitForLoadState('load');

  // Accessible selector for the sidebar search textbox
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await expect(searchBox).toBeVisible({ timeout: 3000 });

  // Fill and submit
  await searchBox.fill('Combination Pliers');
  await searchBox.press('Enter'); // or await page.getByRole('button', { name: 'Search' }).click();

  // Wait for the product link and assert it is present
  const productLink = page.getByRole('link', { name: /^Combination Pliers/i });
  await expect(productLink).toBeVisible({ timeout: 5000 });

  // Verify href pattern
  const href = await productLink.getAttribute('href');
  expect(href).toMatch(/^\/product\//);

  // Optional: click and assert product detail
  // await productLink.click();
  // await expect(page).toHaveURL(/\/product\//);
  // await expect(page.getByRole('heading', { name: /^Combination Pliers/i })).toBeVisible();
});
```

## How to run (Windows PowerShell)

Install Playwright browsers if not already installed:

```powershell
npx playwright install
```

Run the specific test by title (after you add the test file to `tests/`):

```powershell
npx playwright test -g "Search — Find Combination Pliers"
```

## Notes & next steps
- If you want this content to replace the existing plan file `tests/plans/search-specific-product-practice-software-testing.md`, I can either:
  - overwrite that file for you (I currently created a new concrete file to avoid editing the existing file), or
  - provide a PowerShell one-liner you can run to overwrite the original file yourself.
- I can also create the actual test file `tests/search.spec.ts` using the same snippet and (if you want) run it locally — you'll need to run `npx playwright install` before running tests.

---

File saved as `tests/plans/search-specific-product-practice-software-testing-concrete.md`.
