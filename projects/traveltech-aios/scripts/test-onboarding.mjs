// Test script for TravelTech AIOS Onboarding Flow
// This script navigates through all 7 steps and takes screenshots

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '..', 'test-screenshots');

async function main() {
  // Ensure screenshots directory exists
  await mkdir(screenshotsDir, { recursive: true });

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const issues = [];

  try {
    // Step 0: Navigate to login page
    console.log('\n=== Step 0: Login Page ===');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000); // Wait for page to fully render
    await page.screenshot({ path: join(screenshotsDir, '00-login-page.png'), fullPage: true });
    console.log('Screenshot: 00-login-page.png');

    // Click "Try Demo Mode" button
    console.log('Clicking "Try Demo Mode"...');
    const demoButton = page.locator('button:has-text("Try Demo Mode")');
    if (await demoButton.count() > 0) {
      await demoButton.click();
      await page.waitForTimeout(1500);
      console.log('Successfully entered demo mode');
    } else {
      issues.push('ERROR: "Try Demo Mode" button not found');
      console.log('ERROR: "Try Demo Mode" button not found');
    }

    // Step 1: Language Selection
    console.log('\n=== Step 1: Language Selection ===');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(screenshotsDir, '01-language-selection.png'), fullPage: true });
    console.log('Screenshot: 01-language-selection.png');

    // Check if language step is visible
    const languageHeader = page.locator('h1:has-text("Choose your language")');
    if (await languageHeader.count() > 0) {
      console.log('Language selection step is visible');

      // Click on English
      const englishButton = page.locator('button:has-text("English")');
      if (await englishButton.count() > 0) {
        await englishButton.click();
        await page.waitForTimeout(500);
        console.log('Selected English');

        // Click Continue
        const continueBtn = page.locator('button:has-text("Continue")');
        await continueBtn.click();
        await page.waitForTimeout(1000);
      } else {
        issues.push('ERROR: English language option not found');
      }
    } else {
      issues.push('ERROR: Language selection step not visible');
    }

    // Step 2: Business Name
    console.log('\n=== Step 2: Business Name ===');
    await page.screenshot({ path: join(screenshotsDir, '02-business-name.png'), fullPage: true });
    console.log('Screenshot: 02-business-name.png');

    const businessHeader = page.locator('h1:has-text("business name")');
    if (await businessHeader.count() > 0) {
      console.log('Business name step is visible');

      // Type business name
      const input = page.locator('input[placeholder*="Hotel"]');
      if (await input.count() > 0) {
        await input.fill('Test Hotel Demo');
        await page.waitForTimeout(500);
        console.log('Entered business name: Test Hotel Demo');

        // Click Continue
        const continueBtn = page.locator('button:has-text("Continue")');
        await continueBtn.click();
        await page.waitForTimeout(1000);
      } else {
        issues.push('ERROR: Business name input not found');
      }
    } else {
      issues.push('ERROR: Business name step not visible');
    }

    // Step 3: Location (optional)
    console.log('\n=== Step 3: Location ===');
    await page.screenshot({ path: join(screenshotsDir, '03-location.png'), fullPage: true });
    console.log('Screenshot: 03-location.png');

    const locationHeader = page.locator('h1:has-text("located")');
    if (await locationHeader.count() > 0) {
      console.log('Location step is visible');

      // Fill in country
      const countryInput = page.locator('input[placeholder="Country"]');
      if (await countryInput.count() > 0) {
        await countryInput.fill('Portugal');
        console.log('Entered country: Portugal');
      }

      // Skip city (optional)
      await page.waitForTimeout(500);

      // Click Continue
      const continueBtn = page.locator('button:has-text("Continue")');
      await continueBtn.click();
      await page.waitForTimeout(1000);
    } else {
      issues.push('ERROR: Location step not visible');
    }

    // Step 4: Niche
    console.log('\n=== Step 4: Niche Selection ===');
    await page.screenshot({ path: join(screenshotsDir, '04-niche.png'), fullPage: true });
    console.log('Screenshot: 04-niche.png');

    const nicheHeader = page.locator('h1:has-text("focus")');
    if (await nicheHeader.count() > 0) {
      console.log('Niche step is visible');

      // Click on "Boutique Hotel"
      const boutiqueChip = page.locator('button:has-text("Boutique Hotel")');
      if (await boutiqueChip.count() > 0) {
        await boutiqueChip.click();
        await page.waitForTimeout(500);
        console.log('Selected: Boutique Hotel');

        // Click Continue
        const continueBtn = page.locator('button:has-text("Continue")');
        await continueBtn.click();
        await page.waitForTimeout(1000);
      } else {
        issues.push('ERROR: Boutique Hotel niche option not found');
      }
    } else {
      issues.push('ERROR: Niche step not visible');
    }

    // Step 5: Target Audience
    console.log('\n=== Step 5: Target Audience ===');
    await page.screenshot({ path: join(screenshotsDir, '05-target-audience.png'), fullPage: true });
    console.log('Screenshot: 05-target-audience.png');

    const audienceHeader = page.locator('h1:has-text("customers")');
    if (await audienceHeader.count() > 0) {
      console.log('Target audience step is visible');

      // Click on "Leisure" and "Couples"
      const leisureChip = page.locator('button:has-text("Leisure")').first();
      if (await leisureChip.count() > 0) {
        await leisureChip.click();
        await page.waitForTimeout(300);
        console.log('Selected: Leisure');
      }

      const couplesChip = page.locator('button:has-text("Couples")');
      if (await couplesChip.count() > 0) {
        await couplesChip.click();
        await page.waitForTimeout(300);
        console.log('Selected: Couples');
      }

      // Take screenshot after selections
      await page.screenshot({ path: join(screenshotsDir, '05b-target-audience-selected.png'), fullPage: true });

      // Click Continue
      const continueBtn = page.locator('button:has-text("Continue")');
      await continueBtn.click();
      await page.waitForTimeout(1000);
    } else {
      issues.push('ERROR: Target audience step not visible');
    }

    // Step 6: Tone
    console.log('\n=== Step 6: Tone Selection ===');
    await page.screenshot({ path: join(screenshotsDir, '06-tone.png'), fullPage: true });
    console.log('Screenshot: 06-tone.png');

    const toneHeader = page.locator('h1:has-text("tone")');
    if (await toneHeader.count() > 0) {
      console.log('Tone step is visible');

      // Click on "Warm & Welcoming"
      const warmTone = page.locator('button:has-text("Warm & Welcoming")');
      if (await warmTone.count() > 0) {
        await warmTone.click();
        await page.waitForTimeout(500);
        console.log('Selected: Warm & Welcoming');

        // Click Continue
        const continueBtn = page.locator('button:has-text("Continue")');
        await continueBtn.click();
        await page.waitForTimeout(1000);
      } else {
        issues.push('ERROR: Warm & Welcoming tone option not found');
      }
    } else {
      issues.push('ERROR: Tone step not visible');
    }

    // Step 7: Summary
    console.log('\n=== Step 7: Summary ===');
    await page.screenshot({ path: join(screenshotsDir, '07-summary.png'), fullPage: true });
    console.log('Screenshot: 07-summary.png');

    const summaryHeader = page.locator('h1:has-text("Ready")');
    if (await summaryHeader.count() > 0) {
      console.log('Summary step is visible');

      // Verify the summary shows our selections
      const pageContent = await page.content();
      const verifications = [
        { text: 'Test Hotel Demo', name: 'Business name' },
        { text: 'Portugal', name: 'Country' },
        { text: 'Boutique Hotel', name: 'Niche' },
        { text: 'Leisure', name: 'Audience (Leisure)' },
        { text: 'Couples', name: 'Audience (Couples)' },
        { text: 'Warm & Welcoming', name: 'Tone' },
        { text: 'English', name: 'Language' }
      ];

      for (const v of verifications) {
        if (pageContent.includes(v.text)) {
          console.log(`Verified: ${v.name} = ${v.text}`);
        } else {
          issues.push(`WARNING: ${v.name} not found in summary`);
          console.log(`WARNING: ${v.name} not found in summary`);
        }
      }

      // Click "Start Using AIOS"
      const startButton = page.locator('button:has-text("Start Using AIOS")');
      if (await startButton.count() > 0) {
        console.log('\nFound "Start Using AIOS" button');
        await startButton.click();
        await page.waitForTimeout(2000);

        // Take final screenshot of dashboard
        await page.screenshot({ path: join(screenshotsDir, '08-dashboard.png'), fullPage: true });
        console.log('Screenshot: 08-dashboard.png (Dashboard after onboarding)');
      } else {
        issues.push('ERROR: "Start Using AIOS" button not found');
      }
    } else {
      issues.push('ERROR: Summary step not visible');
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('TEST SUMMARY');
    console.log('='.repeat(50));

    if (issues.length === 0) {
      console.log('\nAll 7 onboarding steps completed successfully!');
      console.log('No issues found.');
    } else {
      console.log(`\nIssues found: ${issues.length}`);
      issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
    }

    console.log(`\nScreenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('Test failed with error:', error.message);
    await page.screenshot({ path: join(screenshotsDir, 'error-screenshot.png'), fullPage: true });
    console.log('Error screenshot saved');
    issues.push(`CRITICAL ERROR: ${error.message}`);
  } finally {
    await page.waitForTimeout(3000); // Wait before closing
    await browser.close();
  }

  // Return exit code based on issues
  if (issues.some(i => i.startsWith('ERROR') || i.startsWith('CRITICAL'))) {
    process.exit(1);
  }
}

main().catch(console.error);
