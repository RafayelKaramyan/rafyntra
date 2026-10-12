import { test, expect } from '@playwright/test';

test('the real scene loads and the controls update its configuration', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Matter.');
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', 'webgl');
  await page.getByRole('link', { name: 'Enter the laboratory' }).click();
  await page.getByRole('button', { name: /02.*Orbit/ }).click();
  await expect(page.getByRole('button', { name: /02.*Orbit/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Copper', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copper', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const slider = page.getByRole('slider');
  await slider.focus();
  await slider.press('Home');
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue('1');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(slider).toHaveValue('25');
  expect(errors).toEqual([]);
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
});

test('reduced motion is respected and keyboard navigation remains available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.app')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('link', { name: 'Enter the laboratory' }).click();
  await expect(page.getByText('Reduced motion', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause motion' })).toBeDisabled();
  await page.getByRole('button', { name: /03.*Pulse/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /03.*Pulse/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('a lost graphics context shows the fallback and a retry can recover', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', 'webgl');
  await page.locator('canvas').dispatchEvent('webglcontextlost');
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', 'fallback');
  await page.getByRole('link', { name: 'Enter the laboratory' }).click();
  await expect(page.getByText('3D rendering is unavailable.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Retry 3D' }).click();
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', 'webgl');
});
