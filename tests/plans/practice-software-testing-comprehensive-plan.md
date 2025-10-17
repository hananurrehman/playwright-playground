# Practice Software Testing — Comprehensive Test Plan (tests only)

This document lists focused test cases for the Practice Software Testing demo app. Each entry contains preconditions, concrete steps and the expected result. Timeouts shown are guidance for automated tests.

1) Home page smoke
Precondition: none
Steps:
	1. Navigate to https://practicesoftwaretesting.com
	2. Wait for main product list to appear (timeout 5s)
Expected:
	- Product list visible, site title present. No visible error page.

2) Search — exact match (happy path)
Precondition: home page loaded
Steps:
	1. Focus search textbox (role=textbox name "Search").
	2. Type exact product title (e.g. "Combination Pliers").
 3. Submit by Enter or clicking Search button.
 4. Wait for results container (timeout 5s).
Expected:
	- At least one result contains the exact title. A product link with href starting with `/product/` is visible.

3) Search — partial match
Precondition: home page loaded
Steps:
	1. Search with a fragment (e.g. "Combin" or "Pliers").
	2. Submit and wait for results (timeout 5s).
Expected:
	- Results include items whose titles contain the fragment. No application error.

4) Search — case insensitivity
Precondition: home page loaded
Steps:
	1. Search using different casing variants of a product title.
Expected:
	- Search results are consistent across casings (case-insensitive match).

5) Search — no results handling
Precondition: home page loaded
Steps:
	1. Search for an obviously non-existent string (e.g. "qwerty-nonexistent-12345").
Expected:
	- Clear "no results" message or empty results state shown. Input remains editable; no spinner remains.

6) Search — special characters and long input
Precondition: home page loaded
Steps:
	1. Search with special characters and an SQL-like string: `'; DROP TABLE products; --` and a 1024-char string.
Expected:
	- App handles/sanitizes input: either no results or a user-friendly message. No visible stack traces or server errors.

7) Autocomplete / suggestion (if present)
Precondition: home page loaded
Steps:
	1. Focus search box, type 2–4 letters slowly.
	2. Verify suggestion dropdown appears (timeout 1s).
	3. Select suggestion via keyboard and confirm Enter.
Expected:
	- Suggestions appear quickly and selecting one yields results or navigates to the product.

8) Filters (category / brand / eco)
Precondition: product list visible
Steps:
	1. Apply a category filter (e.g. Pliers) and wait for results (timeout 5s).
	2. Apply brand or eco filter and validate combined filtering.
Expected:
	- Results narrow according to filters. UI shows applied filter state and ability to clear filters.

9) Sorting (Name, Price, CO₂)
Precondition: multiple products visible
Steps:
	1. Change sort order to Name (A-Z), then Price (Low-High), then CO₂ Rating.
	2. Verify result ordering updates accordingly.
Expected:
	- Items are re-ordered to match sort selection, no duplicates or missing items on page.

10) Pagination and navigation
Precondition: search or category returns multiple pages
Steps:
	1. Click page 2, wait for results (timeout 5s).
	2. Click Next/Previous and verify results change.
Expected:
	- Pagination controls navigate distinct result pages; no duplicate entries across pages; URL or state reflects page.

11) Product detail page
Precondition: product link visible
Steps:
	1. Click a product link.
	2. Wait for product detail page (timeout 5s).
Expected:
	- Product heading matches list title; price, CO₂ rating and stock/availability info are visible (if present). URL contains `/product/`.

12) Accessibility basics
Precondition: page loaded
Steps:
	1. Tab through interactive controls (search, filters, pagination, links).
	2. Check that form controls have accessible names (labels or aria-labels).
Expected:
	- Controls are reachable by keyboard and have descriptive names; search textbox and buttons are focusable.

13) Console / client errors
Precondition: run test with console capture
Steps:
	1. Execute major flows (search, open product) while capturing console.
Expected:
	- No uncaught exceptions or error-level console messages related to app logic. Any 4xx/5xx network responses should be handled gracefully.

14) Performance smoke for search
Precondition: home page loaded
Steps:
	1. Time from submit to first visible result for a common query.
Expected:
	- Results appear within acceptable budget (suggested: <= 2s on CI-like environment; adjust per network). Flag slow responses.

15) Network resilience
Precondition: ability to emulate network conditions
Steps:
	1. Throttle network (Slow 3G) or go offline; attempt search.
Expected:
	- App shows informative error or retry behavior; no crash.

16) Localization / language toggle
Precondition: language selector visible
Steps:
	1. Toggle language and ensure search UI labels update.
Expected:
	- Labels change and functionality remains intact.

17) Security / input fuzzing
Precondition: none
Steps:
	1. Run a small set of fuzz inputs (long strings, control chars, unicode, script tags) against search input.
Expected:
	- App does not expose sensitive errors; inputs are sanitized; no server-side destructive behavior.

18) Links & navigation integrity
Precondition: site loaded
Steps:
	1. Click top-level nav links (Home, Contact, Sign in) and verify landing pages (timeout 5s).
Expected:
	- Navigation links work and pages load without 4xx/5xx errors.

19) Regression pattern (save state)
Precondition: apply some filters and search
Steps:
	1. Apply filters and navigate away then back.
Expected:
	- App either preserves filter state or clearly resets; behavior documented and consistent.

20) End-to-end checkout-like (if cart exists)
Precondition: product detail page has an add-to-cart action
Steps:
	1. Add product to cart, view cart, proceed to checkout pages (stop before payment).
Expected:
	- Cart contains the product with correct price and quantity; navigation to checkout pages works and shows summary.

Timeouts and assertions guidance (for automation)
- Prefer role-based selectors: getByRole('textbox', { name: 'Search' }), getByRole('button', { name: 'Search' }), getByRole('link', { name: /Combination Pliers/i })
- Use explicit waits on visible locators, not fixed sleeps. Typical timeouts: 3–5s for UI responses, 1s for autocomplete.
- Fail on console.error messages during test run where practical.

Prioritization (recommended)
- P0: Home smoke, Search exact match, No results handling, Product detail
- P1: Filters, Sorting, Pagination, Autocomplete
- P2: Performance, Accessibility, Security fuzzing, Network resilience

