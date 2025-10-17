# Add-to-Cart Test Plan — Practice Software Testing (product page)

Summary
- Purpose: verify the add-to-cart behavior for a single product page and the client-side signals that confirm the item was added.
- Target page example: https://practicesoftwaretesting.com/product/01K7T6DWZJF6QPG9V7NESZT7GY

Assumptions / starting state
- Tests run from a fresh browser context (no prior cart state).
- Network access to the public demo site is available.
- Tester has permission to add items (no auth required on demo site).

Contract (inputs / outputs)
- Input: Product page URL, optional quantity value
- Output (success): cart contains the item (cart page) OR cart badge increases OR a confirmation toast appears
- Error modes: out-of-stock, server error (4xx/5xx), network timeouts, missing UI controls

Selectors & signals (discovered during exploration)
- Product heading: `h1, h2, [role="heading"]` (first visible heading)
- Add-to-cart button (preferred): `page.getByRole('button', { name: /add to cart|add to basket/i })`
- Add-to-cart fallback buttons: `button:has-text("Add")`, `button[data-test*="add"]`, `[data-test*="add-to-cart"]`
- Quantity input (if present): `input[type="number"]`, `input[name*="qty"]`, `[data-test*="quantity"]`
- Cart page link: `a[href^="/cart"]`, `a[href^="/basket"]`, or link with text `Cart` / `Basket` (role=link)
- Cart badge / indicator: `[data-test*="cart"]`, `.cart-count`, `.cart-badge`
- Confirmation toast: `[role="status"]`, `.toast`, `.notification`, text match `/added to cart|item added/i`

Success criteria (any one of the following)
1. Navigating to the cart page shows the added product listed (title match or SKU). OR
2. The cart/badge indicator becomes visible or increments (numeric increase compared to initial value). OR
3. A visible confirmation toast/message appears that indicates the item was added.

Test cases

A. Happy path — Add single product (priority P0)
Precondition: product page loads
Steps:
1. Navigate to product URL (example above).
2. Wait for product heading (timeout 5s).
3. If a quantity widget exists, set quantity to 1.
4. Click the add-to-cart button.
5. Wait up to 5s for one of: cart link visible, cart badge visible/incremented, confirmation toast.
6. If cart link is present, click it and assert product title appears on cart page.
7. Otherwise, assert badge increment or toast presence.
Expected:
- One of the success signals (cart page with product, badge change, or toast) appears within 5s.

B. Add when out-of-stock (negative / boundary, P1)
Precondition: product page indicates "Out of stock"
Steps:
1. Open product page.
2. Confirm out-of-stock label is visible.
3. Try to find add-to-cart button: it should be disabled or not present.
4. Attempting to add should either be prevented or show a helpful message.
Expected:
- Add is not allowed; a user-friendly message or disabled control is present.

C. Quantity validation (P1)
Precondition: quantity input present and stock known
Steps:
1. Enter quantity 0, expect validation or disabled action.
2. Enter quantity > stock, expect validation/error.
3. Enter valid quantity and add to cart.
Expected:
- UI validates input and prevents invalid adds; valid add succeeds as in happy path.

D. Network error handling (P2)
Steps:
1. Simulate network failure or 5xx from cart endpoint (if supported by test harness).
2. Attempt to add to cart.
Expected:
- App surfaces a clear retryable message and does not crash.

E. Concurrency / duplicate adds (P2)
Steps:
1. Click add-to-cart multiple times quickly.
Expected:
- App either debounces requests, aggregates quantities, or prevents duplicate line items.
- No server errors or duplicate inconsistent state.

F. Accessibility and keyboard flow (P1)
Steps:
1. Tab to the quantity and add-to-cart control; operate via keyboard (Space/Enter).
2. Ensure ARIA notifications (if toasts) announce new cart items via role=status or aria-live.
Expected:
- Controls reachable by keyboard; toast/notification announced to assistive tech.

G. Regression check — persistent cart state (P1)
Steps:
1. Add item to cart.
2. Navigate away and return to cart page.
Expected:
- Cart maintains item(s) in session (or behavior is consistent with documented app behavior).

Failure modes and what to assert when they happen
- No add button found: fail test with clear message "No Add to cart button found".
- No success signals after click: fail with "Add to cart did not produce confirmation".
- Server 4xx/5xx responses: surface as test failure and capture response payload for triage.

Automation guidance / timeouts
- Use role-based selectors where possible: getByRole('button', { name: /add to cart/i })
- Timeouts: 3–5s for UI updates; 1s for toasts/autocomplete.
- Prefer waiting for locator visibility or state changes rather than fixed sleeps.
- Capture console logs and network responses for failed runs.

Minimal Playwright example (TypeScript)

```ts
import { test, expect } from '@playwright/test';

const PRODUCT_URL = 'https://practicesoftwaretesting.com/product/01K7T6DWZJF6QPG9V7NESZT7GY';

test('Add product to cart — product page flow', async ({ page }) => {
  await page.goto(PRODUCT_URL);
  await page.waitForLoadState('load');

  const heading = page.locator('h1, h2, [role="heading"]').first();
  await expect(heading).toBeVisible({ timeout: 5000 });
  const productTitle = (await heading.innerText()).trim();

  const addToCart = page.getByRole('button', { name: /add to cart|add to basket/i });
  const candidates = page.locator('button:has-text("Add"), button[data-test*="add"], [data-test*="add-to-cart"]');
  const addButton = (await addToCart.count()) > 0 ? addToCart.first() : candidates.first();
  await expect(addButton).toBeVisible({ timeout: 3000 });

  // optional: quantity
  const qty = page.locator('input[type="number"], input[name*="qty"]').first();
  if (await qty.count()) await qty.fill('1');

  await addButton.click();

  const cartLink = page.locator('a[href^="/cart"], a[href^="/basket"], a:has-text("Cart")').first();
  const cartBadge = page.locator('[data-test*="cart"], .cart-count, .cart-badge').first();
  const addedToast = page.getByText(/added to cart|item added/i).first();

  // wait for any success signal (cart page, badge, toast)
  await Promise.race([
    addedToast.waitFor({ timeout: 5000 }).catch(() => {}),
    (async () => { if (await cartLink.count()) await cartLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}); })(),
    (async () => { if (await cartBadge.count()) await cartBadge.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}); })(),
  ]);

  if (await cartLink.count()) {
    await cartLink.click();
    await expect(page.getByText(productTitle, { exact: false })).toBeVisible({ timeout: 5000 });
    return;
  }

  if (await cartBadge.count()) {
    await expect(cartBadge).toBeVisible({ timeout: 2000 });
    return;
  }

  if (await addedToast.count()) {
    await expect(addedToast).toBeVisible({ timeout: 1000 });
    return;
  }

  throw new Error('Add to cart did not produce a confirmation (cart page, badge, or toast)');
});
```

Notes & next steps
- If you want me to convert this plan into a runnable spec file in `tests/practice-software/`, I can create it now (I previously created a file but your workspace indicates changes were undone; I will not overwrite anything without your confirmation).
- If you'd like the test to assert price/quantity in cart, run the exploratory script I provided earlier and paste the output — I will then tighten selectors to data-test attributes.

Saved as: `tests/plans/add-to-cart-practice-software.md`
