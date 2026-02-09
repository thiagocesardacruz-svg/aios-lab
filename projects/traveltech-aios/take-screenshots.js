// Playwright script to take screenshots of Prompt Library
import { chromium } from 'playwright';

const screenshotDir = 'C:\\Users\\thiag\\workspace\\aios-lab\\test-screenshots';

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log('1. Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('2. Clicking "Try Demo Mode"...');
    // Look for demo mode button
    const demoButton = page.getByText('Try Demo Mode', { exact: false });
    await demoButton.click();
    await page.waitForTimeout(2000);

    console.log('3. Completing onboarding quickly...');
    // This will depend on the onboarding flow - we'll try to click through
    // Look for any "Next", "Continue", "Skip", or similar buttons
    const skipButtons = ['Skip', 'Next', 'Continue', 'Get Started', 'Start', 'Submit'];

    for (let i = 0; i < 5; i++) { // Try up to 5 times to complete onboarding
      await page.waitForTimeout(1500);

      for (const buttonText of skipButtons) {
        const btn = page.getByRole('button', { name: new RegExp(buttonText, 'i') });
        if (await btn.isVisible().catch(() => false)) {
          console.log(`   Found and clicking "${buttonText}"...`);
          await btn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }

      // Check if we're on the dashboard/main app
      const sidebar = page.locator('nav, [role="navigation"], .sidebar');
      if (await sidebar.isVisible().catch(() => false)) {
        console.log('   Onboarding complete - dashboard visible');
        break;
      }
    }

    await page.waitForTimeout(2000);

    console.log('4. Looking for "Prompt Library" in sidebar...');
    // Try different selectors for the prompt library link
    const promptLibrarySelectors = [
      page.getByText('Prompt Library', { exact: false }),
      page.locator('a:has-text("Prompt Library")'),
      page.locator('[href*="prompt"]'),
      page.getByRole('link', { name: /prompt/i })
    ];

    for (const selector of promptLibrarySelectors) {
      if (await selector.first().isVisible().catch(() => false)) {
        console.log('   Found Prompt Library link, clicking...');
        await selector.first().click();
        await page.waitForTimeout(2000);
        break;
      }
    }

    console.log('5. Taking screenshot of Prompt Library page...');
    await page.screenshot({
      path: `${screenshotDir}\\prompt-library.png`,
      fullPage: false
    });
    console.log('   Saved: prompt-library.png');

    console.log('6. Looking for a prompt to click (e.g., "Instagram Caption Pro")...');
    // Try to find and click on a prompt card
    const promptSelectors = [
      page.getByText('Instagram Caption Pro', { exact: false }),
      page.getByText('Instagram', { exact: false }),
      page.locator('.prompt-card').first(),
      page.locator('[data-prompt]').first(),
      page.locator('article').first(),
      page.locator('.card').first()
    ];

    for (const selector of promptSelectors) {
      if (await selector.isVisible().catch(() => false)) {
        console.log('   Found a prompt, clicking...');
        await selector.click();
        await page.waitForTimeout(2000);
        break;
      }
    }

    console.log('7. Taking screenshot of prompt drawer...');
    await page.screenshot({
      path: `${screenshotDir}\\prompt-drawer.png`,
      fullPage: false
    });
    console.log('   Saved: prompt-drawer.png');

    console.log('\nDone! Screenshots saved to:', screenshotDir);

  } catch (error) {
    console.error('Error:', error.message);
    // Take a screenshot of whatever state we're in for debugging
    await page.screenshot({
      path: `${screenshotDir}\\error-state.png`,
      fullPage: true
    });
    console.log('Error screenshot saved as error-state.png');
  } finally {
    await browser.close();
  }
}

takeScreenshots();
