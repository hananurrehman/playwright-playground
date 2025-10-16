import { test, expect } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com');
  await page.waitForLoadState('load');
  await expect(page.getByText('Practice Black Box Testing')).toBeVisible();
});


