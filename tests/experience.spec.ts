import { test, expect, type Page } from '@playwright/test';

async function expectedRenderer(page: Page, browserName: string): Promise<'webgl' | 'fallback'> {
  // Chromium projects must render the real scene. Firefox runners may lack a graphics device.
  if (browserName !== 'firefox') return 'webgl';
  const supported = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  });
  if (!supported) {
    test.info().annotations.push({
      type: 'graphics-capability',
      description:
        'WebGL2 is unavailable in this Firefox environment; fallback behavior is tested.',
    });
  }
  return supported ? 'webgl' : 'fallback';
}

test('the available renderer loads and controls update its configuration', async ({
  page,
  browserName,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Matter.');
  const renderer = await expectedRenderer(page, browserName);
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', renderer);
  if (renderer === 'webgl' && browserName === 'chromium') {
    await test.info().attach('initial-3d-scene', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
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
  await expect(slider).toHaveValue('0');
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

test('graphics failure preserves the interface and retry respects device capability', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  const renderer = await expectedRenderer(page, browserName);
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', renderer);
  if (renderer === 'webgl') {
    await page.locator('canvas').dispatchEvent('webglcontextlost');
  }
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', 'fallback');
  await page.getByRole('link', { name: 'Enter the laboratory' }).click();
  await expect(
    page.getByRole('img', { name: 'Static illustration of the selected material' }).first(),
  ).toBeVisible();
  await expect(page.getByText('3D rendering is unavailable.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Retry 3D' }).click();
  await expect(page.getByTestId('scene-container')).toHaveAttribute('data-renderer', renderer);
  if (renderer === 'fallback') {
    await expect(page.getByRole('button', { name: 'Retry 3D' })).toBeEnabled();
    await page.getByRole('button', { name: /03.*Pulse/ }).click();
    await expect(page.getByRole('button', { name: /03.*Pulse/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  }
});
