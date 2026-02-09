import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('screenshot goals page', async ({ page }) => {
  const screenshotsDir = path.resolve(__dirname, '../../test-screenshots');

  // Navigate to the app
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Step 1: Click "Try Demo Mode" button
  console.log('Step 1: Clicking Demo Mode...');
  await page.locator('text=Try Demo Mode').click();
  await page.waitForTimeout(1000);

  // Step 2: Complete onboarding
  console.log('Step 2: Starting onboarding...');

  // Language selection - click English
  console.log('Selecting English...');
  await page.locator('text=English').click();
  await page.waitForTimeout(500);

  // Click Continue to go to business name step
  console.log('Clicking Continue...');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);

  // Type business name "Test Hotel"
  console.log('Typing business name...');
  const businessInput = page.locator('input[placeholder="Hotel Belvedere & Spa"]');
  await businessInput.fill('Test Hotel');
  await page.waitForTimeout(300);

  // Click Continue to go to location step
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);

  // Location step - can skip (optional)
  console.log('Skipping location step...');
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);

  // Niche step - select Boutique Hotel
  console.log('Selecting niche...');
  await page.locator('text=Boutique Hotel').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);

  // Target Audience - select Leisure
  console.log('Selecting target audience...');
  await page.locator('button:has-text("Leisure")').first().click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);

  // Tone - select Warm & Welcoming
  console.log('Selecting tone...');
  await page.locator('text=Warm & Welcoming').click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Continue")').click();
  await page.waitForTimeout(500);

  // Summary - click Start Using AIOS
  console.log('Completing onboarding...');
  await page.locator('button:has-text("Start Using AIOS")').click();
  await page.waitForTimeout(2000);

  // Wait for dashboard to load
  console.log('Waiting for dashboard...');
  await page.waitForLoadState('networkidle');

  // Step 3: Click on "Goals" in the sidebar (it's a button, not a link)
  console.log('Step 3: Clicking Goals in sidebar...');
  // The sidebar navigation uses buttons
  await page.locator('aside button:has-text("Goals")').click();
  await page.waitForTimeout(1500);

  // Step 4: Take screenshot of Goals page
  console.log('Step 4: Taking screenshot of Goals page...');
  await page.screenshot({
    path: path.join(screenshotsDir, 'goals-page.png'),
    fullPage: true
  });
  console.log('Screenshot 1: Goals page saved');

  // Step 5: Click on "Sales Conversion" to expand it (Customer Acquisition is already expanded by default)
  console.log('Step 5: Clicking Sales Conversion...');
  await page.locator('button:has-text("Sales Conversion")').click();
  await page.waitForTimeout(1000);

  // Step 6: Take screenshot of expanded state
  console.log('Step 6: Taking screenshot of expanded state...');
  await page.screenshot({
    path: path.join(screenshotsDir, 'goals-expanded.png'),
    fullPage: true
  });
  console.log('Screenshot 2: Goals expanded state saved');
});
