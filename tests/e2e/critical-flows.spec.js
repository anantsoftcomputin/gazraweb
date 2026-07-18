import { expect, test } from '@playwright/test';

test('public home and primary navigation render', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Community, Care, Culture/i);
  await expect(page.locator('body')).toContainText(/Gazra/i);
  await page.goto('/events');
  await expect(page.getByRole('heading', { name: /events/i }).first()).toBeVisible();
  await page.goto('/cafe');
  await expect(page.locator('body')).toContainText(/cafe/i);
});

test('contact form preserves verification gate', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('heading', { name: 'Connect with Gazra' })).toBeVisible();
  await expect(page.getByRole('button', { name: /send otp/i })).toBeVisible();
});

test('unauthenticated admin route is protected', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: /admin portal/i })).toBeVisible();
});

test('legal and privacy pages remain accessible', async ({ page }) => {
  await page.goto('/privacy-policy');
  await expect(page.getByRole('heading', { name: /privacy/i }).first()).toBeVisible();
  await page.goto('/terms-and-conditions');
  await expect(page.getByRole('heading', { name: /terms/i }).first()).toBeVisible();
});
