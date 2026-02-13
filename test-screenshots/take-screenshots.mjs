import { chromium } from 'playwright';

const screenshotDir = 'C:/Users/thiag/workspace/aios-lab/test-screenshots';

async function takeScreenshots() {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  try {
    // 1. Navigate to localhost:3000
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. Click "Try Demo Mode" button
    console.log('Looking for "Try Demo Mode" button...');
    const demoButton = page.getByRole('button', { name: /try demo/i });
    if (await demoButton.isVisible()) {
      console.log('Clicking "Try Demo Mode" button...');
      await demoButton.click();
      await page.waitForTimeout(1500);
    } else {
      // Try finding by text
      const demoLink = page.getByText(/try demo/i);
      if (await demoLink.isVisible()) {
        await demoLink.click();
        await page.waitForTimeout(1500);
      }
    }

    // 3. Complete onboarding quickly (any selections)
    console.log('Completing onboarding...');

    // Try to find and complete onboarding steps
    // Look for any continue/next/skip buttons and click them
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1000);

      // Check if we're on the dashboard (look for DNA in sidebar)
      const dnaLink = page.locator('text=DNA').first();
      if (await dnaLink.isVisible().catch(() => false)) {
        console.log('Dashboard detected, onboarding complete!');
        break;
      }

      // Try clicking various onboarding buttons
      const continueBtn = page.getByRole('button', { name: /continue|next|skip|start|begin|let.*s go|get started/i });
      if (await continueBtn.first().isVisible().catch(() => false)) {
        console.log('Clicking continue/next button...');
        await continueBtn.first().click();
        await page.waitForTimeout(500);
        continue;
      }

      // Try clicking any selectable options (first one)
      const selectableOption = page.locator('[role="button"], [data-selectable], .cursor-pointer').first();
      if (await selectableOption.isVisible().catch(() => false)) {
        // Only click if it looks like an option, not navigation
        const text = await selectableOption.textContent().catch(() => '');
        if (!text.includes('DNA') && !text.includes('Home')) {
          console.log('Clicking option:', text?.substring(0, 30));
          await selectableOption.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }
    }

    // 4. Click "DNA" in sidebar
    console.log('Looking for DNA in sidebar...');
    await page.waitForTimeout(2000);

    // Try different selectors for DNA link
    let dnaClicked = false;
    const dnaSelectors = [
      'text=DNA',
      '[href*="dna"]',
      'a:has-text("DNA")',
      'button:has-text("DNA")',
      '[data-testid*="dna"]'
    ];

    for (const selector of dnaSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`Clicking DNA using selector: ${selector}`);
          await element.click();
          dnaClicked = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!dnaClicked) {
      console.log('DNA link not found, taking current screenshot anyway...');
    }

    await page.waitForTimeout(2000);

    // 5. Take screenshot of the DNA page
    console.log('Taking screenshot of DNA page...');
    await page.screenshot({
      path: `${screenshotDir}/dna-page.png`,
      fullPage: false
    });
    console.log('Saved dna-page.png');

    // 6. Click the pencil/edit button on one of the fields
    console.log('Looking for edit button...');

    // Hover over fields to reveal edit buttons
    const fieldSelectors = [
      '.group',
      '[data-field]',
      'div:has(> span)',
      '.field-container'
    ];

    // First try to find edit buttons directly
    let editClicked = false;
    const editSelectors = [
      '[aria-label*="edit" i]',
      '[title*="edit" i]',
      'button:has(svg)',
      '[data-testid*="edit"]',
      '.edit-button',
      'button.opacity-0',
      'button:has([data-lucide="pencil"])',
      'button:has([data-lucide="pen"])'
    ];

    // First, try hovering over cards/fields to reveal edit buttons
    const cards = page.locator('.group, [class*="card"], [class*="field"]');
    const cardCount = await cards.count();
    console.log(`Found ${cardCount} potential card elements`);

    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      if (await card.isVisible().catch(() => false)) {
        await card.hover();
        await page.waitForTimeout(500);

        // Look for edit button that appeared
        for (const editSelector of editSelectors) {
          const editBtn = page.locator(editSelector).first();
          if (await editBtn.isVisible({ timeout: 500 }).catch(() => false)) {
            console.log(`Found edit button with selector: ${editSelector}`);
            await editBtn.click();
            editClicked = true;
            break;
          }
        }

        if (editClicked) break;
      }
    }

    if (!editClicked) {
      // Try clicking on any pencil icon directly
      const pencilIcons = page.locator('svg[class*="lucide"], [class*="icon"]');
      const iconCount = await pencilIcons.count();
      console.log(`Found ${iconCount} icons, looking for pencil...`);

      for (let i = 0; i < Math.min(iconCount, 10); i++) {
        const icon = pencilIcons.nth(i);
        const parent = icon.locator('xpath=..');
        if (await parent.isVisible().catch(() => false)) {
          const tagName = await parent.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
          if (tagName === 'button') {
            console.log('Clicking button with icon...');
            await parent.click();
            editClicked = true;
            await page.waitForTimeout(1000);
            break;
          }
        }
      }
    }

    await page.waitForTimeout(2000);

    // 7. Take screenshot showing the edit modal
    console.log('Taking screenshot of edit modal...');
    await page.screenshot({
      path: `${screenshotDir}/dna-edit-modal.png`,
      fullPage: false
    });
    console.log('Saved dna-edit-modal.png');

    console.log('Screenshots completed successfully!');

  } catch (error) {
    console.error('Error during automation:', error);
    // Take a screenshot of whatever state we're in
    await page.screenshot({
      path: `${screenshotDir}/error-state.png`,
      fullPage: false
    });
  } finally {
    await browser.close();
  }
}

takeScreenshots();
