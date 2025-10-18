# Playwright Playground – Portfolio & R&D
This repository is a portfolio-quality Playwright playground for R&D experimentation and documenting learnings, including future Playwright Agents work.

## Apps Under Test
- Restful Booker – `https://restful-booker.herokuapp.com`
- The Internet – `https://the-internet.herokuapp.com`
- Practice Software Testing – `https://practicesoftwaretesting.com`

## Architecture Overview
- Page Object Model (POM) in `pages/`
- Custom fixtures in `fixtures/`
- Tests organized by app in `tests/`
- Shared config in `config/apps.ts`
- Test plans and notes in `specs/`

## Getting Started
1. Install dependencies: `npm install`
2. Run all tests: `npm run test`
3. UI mode: `npm run test:ui`
4. Open last report: `npm run report`

