const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 900 }
};

const VISUALS_DIR = path.resolve('C:/Users/ACER/.gemini/antigravity-ide/brain/64dbf582-628e-4aa3-87de-7b4ceb2b23a4/visuals');

if (!fs.existsSync(VISUALS_DIR)) {
  fs.mkdirSync(VISUALS_DIR, { recursive: true });
}

// Helper to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log('Starting visual comparisons...');
  const browser = await chromium.launch({ headless: true });

  // 1. Create a context for the reference site (localhost:8081)
  const refContext = await browser.newContext();
  const refPage = await refContext.newPage();
  
  // Set up login state on ref site first by visiting homepage and setting localStorage
  console.log('Setting up mock login state on prototype reference site...');
  await refPage.goto('http://localhost:8081/halaman/storefront-home.html', { waitUntil: 'networkidle' });
  await refPage.evaluate(() => {
    localStorage.setItem('ciamik_is_logged_in', 'true');
    localStorage.setItem('ciamik_phone', '081234567890');
  });

  // 2. Create a context for Storybook (localhost:6006)
  const sbContext = await browser.newContext();
  const sbPage = await sbContext.newPage();
  
  console.log('Setting up mock login state on Storybook...');
  await sbPage.goto('http://localhost:6006/iframe.html?id=showcase-storefront-home--mobile&viewMode=story', { waitUntil: 'networkidle' });
  await sbPage.evaluate(() => {
    localStorage.setItem('ciamik_is_logged_in', 'true');
    localStorage.setItem('ciamik_phone', '081234567890');
  });

  // Define tasks
  const tasks = [
    // --- Storefront Home ---
    {
      name: 'storefront_home',
      refUrl: 'http://localhost:8081/halaman/storefront-home.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-storefront-home--mobile&viewMode=story',
      viewports: ['mobile', 'desktop']
    },
    // --- Storefront PDP ---
    {
      name: 'storefront_pdp',
      refUrl: 'http://localhost:8081/halaman/storefront-pdp.html?id=1',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-storefront-pdp--mobile&viewMode=story',
      viewports: ['mobile', 'desktop'],
      interactions: [
        {
          name: 'variants_sheet',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            if (isRef) {
              // Clicking reviews link triggers reviews bottom sheet in ref
              await page.click('#lnkSeeAllReviews');
            } else {
              // Click "Beli Langsung" to trigger variants sheet in SB
              await page.click('button:has-text("Beli Langsung")');
            }
            await delay(800); // wait for transitions
          }
        }
      ]
    },
    // --- Storefront Checkout ---
    {
      name: 'storefront_checkout',
      refUrl: 'http://localhost:8081/halaman/storefront-checkout.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-storefront-checkout--mobile&viewMode=story',
      viewports: ['mobile', 'desktop'],
      interactions: [
        {
          name: 'checkout_actions',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            if (isRef) {
              // Click "Ubah" (btnEditAddress) to trigger address sheet
              await page.click('#btnEditAddress');
            } else {
              // Click "Bayar Sekarang" to trigger OTP Flow
              await page.click('button:has-text("Bayar Sekarang")');
            }
            await delay(800);
          }
        }
      ]
    },
    // --- Backoffice Dashboard ---
    {
      name: 'backoffice_dashboard',
      refUrl: 'http://localhost:8081/halaman/backoffice/dashboard.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-backoffice-dashboard--desktop&viewMode=story',
      viewports: ['desktop']
    },
    // --- Backoffice Orders ---
    {
      name: 'backoffice_orders',
      refUrl: 'http://localhost:8081/halaman/backoffice/orders.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-backoffice-orders--desktop&viewMode=story',
      viewports: ['desktop'],
      interactions: [
        {
          name: 'detail_pane',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            if (isRef) {
              // Wait for table to load and click first row to open detail pane
              await page.waitForSelector('table.data-table tbody tr');
              await page.click('table.data-table tbody tr:first-child');
            } else {
              // Click "Detail" link in first row to open DetailPane
              await page.waitForSelector('button:has-text("Detail")');
              await page.click('button:has-text("Detail") >> nth=0');
            }
            await delay(800);
          }
        }
      ]
    },
    // --- Backoffice Fulfillment ---
    {
      name: 'backoffice_fulfillment',
      refUrl: 'http://localhost:8081/halaman/backoffice/fulfillment.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-backoffice-fulfillment--desktop&viewMode=story',
      viewports: ['desktop'],
      interactions: [
        {
          name: 'fulfillment_detail',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            if (isRef) {
              await page.waitForSelector('.kanban-card');
              await page.click('.kanban-card:first-child');
            } else {
              await page.waitForSelector('[class*="draggableCardWrapper"]');
              await page.click('[class*="draggableCardWrapper"] >> nth=0', { force: true });
            }
            await delay(800);
          }
        }
      ]
    },
    // --- Backoffice Catalog ---
    {
      name: 'backoffice_catalog',
      refUrl: 'http://localhost:8081/halaman/backoffice/catalog-products.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-backoffice-catalog--desktop&viewMode=story',
      viewports: ['desktop'],
      interactions: [
        {
          name: 'add_product_modal',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            if (isRef) {
              await page.click('button:has-text("Tambah Produk")');
            } else {
              await page.click('button:has-text("Tambah Produk")');
            }
            await delay(800);
          }
        }
      ]
    }
  ];

  for (const task of tasks) {
    console.log(`\nProcessing ${task.name}...`);
    for (const vpName of task.viewports) {
      const viewport = VIEWPORTS[vpName];
      console.log(`  Viewport: ${vpName} (${viewport.width}x${viewport.height})`);

      // Reference
      await refPage.setViewportSize(viewport);
      await refPage.goto(task.refUrl, { waitUntil: 'networkidle' });
      await delay(1200);
      const refPath = path.join(VISUALS_DIR, `ref_${task.name}_${vpName}.png`);
      await refPage.screenshot({ path: refPath });
      console.log(`    Captured Reference: ${refPath}`);

      // Storybook
      await sbPage.setViewportSize(viewport);
      await sbPage.goto(task.sbUrl, { waitUntil: 'networkidle' });
      await delay(1200);
      const sbPath = path.join(VISUALS_DIR, `sb_${task.name}_${vpName}.png`);
      await sbPage.screenshot({ path: sbPath });
      console.log(`    Captured Storybook: ${sbPath}`);

      // Interactions
      if (task.interactions) {
        for (const inter of task.interactions) {
          if (inter.viewports.includes(vpName)) {
            console.log(`    Running interaction: ${inter.name}`);
            
            // Reference interaction
            await refPage.goto(task.refUrl, { waitUntil: 'networkidle' });
            await delay(1200);
            try {
              await inter.action(refPage, true);
              const refInterPath = path.join(VISUALS_DIR, `ref_${task.name}_${vpName}_${inter.name}.png`);
              await refPage.screenshot({ path: refInterPath });
              console.log(`      Captured Reference Interaction: ${refInterPath}`);
            } catch (err) {
              console.error(`      Error in reference interaction ${inter.name}:`, err.message);
            }

            // Storybook interaction
            await sbPage.goto(task.sbUrl, { waitUntil: 'networkidle' });
            await delay(1200);
            try {
              await inter.action(sbPage, false);
              const sbInterPath = path.join(VISUALS_DIR, `sb_${task.name}_${vpName}_${inter.name}.png`);
              await sbPage.screenshot({ path: sbInterPath });
              console.log(`      Captured Storybook Interaction: ${sbInterPath}`);
            } catch (err) {
              console.error(`      Error in storybook interaction ${inter.name}:`, err.message);
            }
          }
        }
      }
    }
  }

  await browser.close();
  console.log('\nAll visual comparison captures completed!');
}

run().catch(err => {
  console.error('Fatal error running visual comparison:', err);
  process.exit(1);
});
