import { test as base, expect, Page } from '@playwright/test';

type AppFixtures = {
  restfulBookerPage: Page;
  theInternetPage: Page;
  practiceSoftwarePage: Page;
};

export const test = base.extend<AppFixtures>({
  restfulBookerPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  theInternetPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  practiceSoftwarePage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };


