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

    // 3. Complete onboarding quickly (7 steps)
    console.log('Completing onboarding...');

    // Step 1: Language - Click English (GB)
    console.log('Step 1: Selecting English...');
    await page.waitForTimeout(1000);
    // Language cards have text like "English", "Portugues", etc.
    const englishCard = page.locator('button:has-text("English")').first();
    if (await englishCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await englishCard.click();
      await page.waitForTimeout(500);
    }
    // Click Continue
    await page.locator('button:has-text("Continue"):not([disabled])').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Step 2: Business Name - Type any name
    console.log('Step 2: Entering business name...');
    const nameInput = page.locator('input[placeholder*="Hotel"]').first();
    if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nameInput.fill('Test Hotel Demo');
      await page.waitForTimeout(500);
    }
    await page.locator('button:has-text("Continue"):not([disabled])').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Step 3: Location (optional) - Just click Continue
    console.log('Step 3: Skipping location (optional)...');
    const countryInput = page.locator('input[placeholder*="Country"]').first();
    if (await countryInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await countryInput.fill('Portugal');
      await page.waitForTimeout(300);
    }
    await page.locator('button:has-text("Continue"):not([disabled])').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Step 4: Niche - Click first option (Boutique Hotel)
    console.log('Step 4: Selecting niche...');
    const nicheChip = page.locator('button:has-text("Boutique")').first();
    if (await nicheChip.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nicheChip.click();
      await page.waitForTimeout(500);
    } else {
      // Try clicking any chip
      const anyChip = page.locator('button.rounded-xl').first();
      if (await anyChip.isVisible().catch(() => false)) {
        await anyChip.click();
        await page.waitForTimeout(500);
      }
    }
    await page.locator('button:has-text("Continue"):not([disabled])').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Step 5: Target Audience - Select "Leisure"
    console.log('Step 5: Selecting target audience...');
    const leisureChip = page.locator('button:has-text("Leisure")').first();
    if (await leisureChip.isVisible({ timeout: 5000 }).catch(() => false)) {
      await leisureChip.click();
      await page.waitForTimeout(500);
    } else {
      // Try clicking any chip
      const anyChip = page.locator('button.rounded-xl').first();
      if (await anyChip.isVisible().catch(() => false)) {
        await anyChip.click();
        await page.waitForTimeout(500);
      }
    }
    await page.locator('button:has-text("Continue"):not([disabled])').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Step 6: Tone - Select "Professional & Formal"
    console.log('Step 6: Selecting tone...');
    const toneCard = page.locator('button:has-text("Professional")').first();
    if (await toneCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await toneCard.click();
      await page.waitForTimeout(500);
    }
    await page.locator('button:has-text("Continue"):not([disabled])').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // Step 7: Summary - Click "Start Using AIOS"
    console.log('Step 7: Completing onboarding...');
    const startBtn = page.locator('button:has-text("Start Using AIOS"), button:has-text("Start")').first();
    if (await startBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }

    // 4. Now we should be on the dashboard - Click "DNA" in sidebar
    console.log('Looking for DNA in sidebar...');
    await page.waitForTimeout(2000);

    // Try different selectors for DNA link
    let dnaClicked = false;
    const dnaSelectors = [
      'a:has-text("DNA")',
      '[href*="dna"]',
      'text=DNA',
      'button:has-text("DNA")',
      'nav >> text=DNA',
      'aside >> text=DNA'
    ];

    for (const selector of dnaSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
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
      console.log('DNA link not found directly, trying to find in sidebar...');
      // Take a screenshot of current state to debug
      await page.screenshot({
        path: `${screenshotDir}/current-state.png`,
        fullPage: false
      });
      console.log('Saved current-state.png for debugging');
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

    let editClicked = false;

    // First, try hovering over DNA field cards to reveal edit buttons
    // DNA fields typically have labels like "Business Name", "Location", etc.
    const dnaFields = page.locator('[class*="group"], .card, [class*="rounded"][class*="bg-zinc"]');
    const fieldCount = await dnaFields.count();
    console.log(`Found ${fieldCount} potential field elements`);

    for (let i = 0; i < Math.min(fieldCount, 15); i++) {
      const field = dnaFields.nth(i);
      if (await field.isVisible().catch(() => false)) {
        const text = await field.textContent().catch(() => '');
        // Look for DNA-related fields
        if (text && (text.includes('Business') || text.includes('Location') ||
            text.includes('Target') || text.includes('Tone') || text.includes('Name') ||
            text.includes('Niche') || text.includes('Audience'))) {
          console.log(`Hovering over field: ${text.substring(0, 40)}...`);
          await field.hover();
          await page.waitForTimeout(600);

          // Look for edit button that appeared (might have opacity-0 class that becomes visible on hover)
          const editBtn = field.locator('button, [role="button"]').first();
          if (await editBtn.isVisible({ timeout: 500 }).catch(() => false)) {
            console.log('Found and clicking edit button in field...');
            await editBtn.click();
            editClicked = true;
            break;
          }
        }
      }
    }

    if (!editClicked) {
      // Try clicking on any small button with SVG icon (likely edit buttons)
      console.log('Trying to find edit buttons directly...');
      const svgButtons = page.locator('button:has(svg)');
      const btnCount = await svgButtons.count();
      console.log(`Found ${btnCount} buttons with SVG icons`);

      for (let i = 0; i < Math.min(btnCount, 15); i++) {
        const btn = svgButtons.nth(i);
        if (await btn.isVisible().catch(() => false)) {
          // Check if it's a small icon button (not a main action button)
          const box = await btn.boundingBox().catch(() => null);
          if (box && box.width < 60 && box.height < 60) {
            // Hover first to make sure it's visible
            await btn.hover();
            await page.waitForTimeout(200);
            console.log(`Clicking icon button ${i}...`);
            await btn.click();
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
    console.error('Error during automation:', error.message);
    // Take a screenshot of whatever state we're in
    await page.screenshot({
      path: `${screenshotDir}/error-state.png`,
      fullPage: false
    });
    console.log('Saved error-state.png');
  } finally {
    await browser.close();
  }
}

takeScreenshots();
