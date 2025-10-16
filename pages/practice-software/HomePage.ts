import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heroTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroTitle = page.locator('h1');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://practicesoftwaretesting.com');
    await this.page.waitForLoadState('load');
  }

  async assertLoaded(): Promise<void> {
    await expect(this.heroTitle).toBeVisible();
  }
}


