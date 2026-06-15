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

// Helper for safe playwright interactions
async function safeAction(page, description, fn) {
  try {
    console.log(`      Running: ${description}...`);
    await fn();
    await delay(600); // Wait for transitions/animations to finish
  } catch (err) {
    console.warn(`      [WARN] Failed: ${description} - ${err.message}`);
  }
}

async function run() {
  console.log('Starting interactive site crawler and visual comparisons...');
  const browser = await chromium.launch({ headless: true });

  // 1. Create a context for the reference site (localhost:8081)
  const refContext = await browser.newContext();
  const refPage = await refContext.newPage();
  refPage.on('console', msg => {
    if (msg.type() === 'error') console.error('REF CONSOLE ERROR:', msg.text());
  });
  
  // Set up login state on ref site first by visiting homepage and setting localStorage
  console.log('Setting up mock login state on prototype reference site...');
  await refPage.goto('http://localhost:8081/halaman/storefront-home.html', { waitUntil: 'networkidle' });
  await refPage.evaluate(() => {
    localStorage.setItem('ciamik_is_logged_in', 'true');
    localStorage.setItem('ciamik_phone', '081234567890');
    localStorage.setItem('ciamik_user_name', 'Ahmad Maulana');
  });

  // 2. Create a context for Storybook (localhost:6006)
  const sbContext = await browser.newContext();
  const sbPage = await sbContext.newPage();
  sbPage.on('console', msg => {
    if (msg.type() === 'error') console.error('SB CONSOLE ERROR:', msg.text());
  });
  
  console.log('Setting up mock login state on Storybook...');
  await sbPage.goto('http://localhost:6006/iframe.html?id=showcase-storefront-home--mobile&viewMode=story', { waitUntil: 'networkidle' });
  await sbPage.evaluate(() => {
    localStorage.setItem('ciamik_is_logged_in', 'true');
    localStorage.setItem('ciamik_phone', '081234567890');
    localStorage.setItem('ciamik_user_name', 'Ahmad Maulana');
  });

  // Define tasks
  const tasks = [
    // --- Storefront Home ---
    {
      name: 'storefront_home',
      refUrl: 'http://localhost:8081/halaman/storefront-home.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-storefront-home--mobile&viewMode=story',
      viewports: ['mobile'],
      interactions: [
        {
          name: 'cart_sheet',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open Cart Sheet', async () => {
              if (isRef) {
                await page.click('#navCart');
              } else {
                await page.click('nav[aria-label="Bottom Navigation"] button >> nth=2');
              }
            });
          }
        },
        {
          name: 'profile_sidebar',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open Profile Sidebar', async () => {
              if (isRef) {
                await page.click('#navProfile');
              } else {
                await page.click('nav[aria-label="Bottom Navigation"] button >> nth=3');
              }
            });
          }
        }
      ]
    },
    
    // --- Storefront PDP ---
    {
      name: 'storefront_pdp',
      refUrl: 'http://localhost:8081/halaman/storefront-pdp.html?id=1',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-storefront-pdp--mobile&viewMode=story',
      viewports: ['mobile'],
      interactions: [
        {
          name: 'variants_sheet',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open Variants Sheet', async () => {
              if (isRef) {
                if (await page.locator('#pdpColors .v-chip').count() > 0) {
                  await page.click('#pdpColors .v-chip:first-child');
                }
                if (await page.locator('#pdpSizes .v-chip').count() > 0) {
                  await page.click('#pdpSizes .v-chip:first-child');
                }
                await page.click('#pdpBuyNowBtn, #btnBuyNow, button:has-text("Beli"), button.checkout-btn');
              } else {
                await page.click('button:has-text("Beli Langsung")');
              }
            });
          }
        },
        {
          name: 'pdp_cart_sheet',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open PDP Cart Sheet', async () => {
              if (isRef) {
                await page.click('#navCart');
              } else {
                await page.click('nav[aria-label="Bottom Navigation"] button >> nth=2');
              }
            });
          }
        }
      ]
    },

    // --- Storefront Checkout ---
    {
      name: 'storefront_checkout',
      refUrl: 'http://localhost:8081/halaman/storefront-checkout.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-storefront-checkout--mobile&viewMode=story',
      viewports: ['mobile'],
      interactions: [
        {
          name: 'checkout_otp_flow',
          viewports: ['mobile'],
          action: async (page, isRef) => {
            await safeAction(page, 'Trigger OTP Flow', async () => {
              if (isRef) {
                await page.click('#btnPlaceOrder, button:has-text("Bayar")');
              } else {
                await page.click('button:has-text("Bayar Sekarang")');
              }
            });
          }
        }
      ]
    },

    // --- Backoffice Dashboard ---
    {
      name: 'backoffice_dashboard',
      refUrl: 'http://localhost:8081/halaman/backoffice/dashboard.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-backoffice-dashboard--desktop&viewMode=story',
      viewports: ['desktop'],
      interactions: [
        {
          name: 'revenue_drilldown',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Drilldown Revenue Card', async () => {
              if (isRef) {
                await page.click('#mc-revenue');
              } else {
                await page.click('text=/Revenue/i');
              }
            });
          }
        }
      ]
    },

    // --- Backoffice Orders ---
    {
      name: 'backoffice_orders',
      refUrl: 'http://localhost:8081/halaman/backoffice/orders.html',
      sbUrl: 'http://localhost:6006/iframe.html?id=showcase-backoffice-orders--desktop&viewMode=story',
      viewports: ['desktop'],
      interactions: [
        {
          name: 'order_row_detail',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open Order Row Detail', async () => {
              if (isRef) {
                await page.waitForSelector('table.data-table tbody tr');
                await page.click('table.data-table tbody tr:first-child');
              } else {
                await page.waitForSelector('table.ciamik-data-table tbody tr');
                await page.click('table.ciamik-data-table tbody tr:first-child');
              }
            });
          }
        },
        {
          name: 'list_view',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Switch to List View', async () => {
              if (isRef) {
                await page.click('.view-btn[data-view="list"]');
              } else {
                await page.click('button:has-text("List")');
              }
            });
          }
        },
        {
          name: 'cards_view',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Switch to Cards View', async () => {
              if (isRef) {
                await page.click('.view-btn[data-view="cards"]');
              } else {
                await page.click('button:has-text("Cards")');
              }
            });
          }
        },
        {
          name: 'kanban_view',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Switch to Kanban View & Drag Card', async () => {
              if (isRef) {
                await page.click('.view-btn[data-view="kanban"]');
                await page.waitForSelector('.kanban-card', { state: 'visible', timeout: 5000 }).catch(() => {});
                const count = await page.locator('.kanban-card').count();
                console.log('      [DEBUG] Reference Kanban Card Count in run:', count);
                // Try drag card in prototype
                await page.dragAndDrop('.kanban-card:first-child', '.kanban-col >> nth=2');
              } else {
                await page.click('button:has-text("Kanban")');
                await delay(500);
                // Toggle column selector chip
                await page.click('button:has-text("Dikirim")');
                await delay(300);
                // Perform HTML5 drag and drop in Storybook
                const source = '[data-testid^="kanban-card-"] >> nth=0';
                const target = '[data-testid="kanban-column-SHIPPED"]';
                if (await page.locator(source).count() > 0) {
                  await page.dragAndDrop(source, target);
                }
              }
            });
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
          name: 'fulfillment_detail_pane',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open Fulfillment Card Detail', async () => {
              if (isRef) {
                await page.waitForSelector('.kanban-card');
                await page.click('.kanban-card:first-child');
              } else {
                await page.waitForSelector('[class*="draggableCardWrapper"]');
                await page.click('[class*="draggableCardWrapper"] >> nth=0', { force: true });
              }
            });
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
          name: 'add_product_modal_popup',
          viewports: ['desktop'],
          action: async (page, isRef) => {
            await safeAction(page, 'Open Add Product Modal', async () => {
              await page.click('button:has-text("Tambah Produk")');
            });
          }
        }
      ]
    }
  ];

  for (const task of tasks) {
    console.log(`\nProcessing task: ${task.name}...`);
    for (const vpName of task.viewports) {
      const viewport = VIEWPORTS[vpName];
      console.log(`  Viewport: ${vpName} (${viewport.width}x${viewport.height})`);

      // Base Screenshots
      await refPage.setViewportSize(viewport);
      await refPage.goto(task.refUrl, { waitUntil: 'networkidle' });
      await delay(1200);
      const refPath = path.join(VISUALS_DIR, `ref_${task.name}_${vpName}.png`);
      await refPage.screenshot({ path: refPath });
      console.log(`    Captured Reference: ${refPath}`);

      await sbPage.setViewportSize(viewport);
      await sbPage.goto(task.sbUrl, { waitUntil: 'networkidle' });
      await delay(1200);
      const sbPath = path.join(VISUALS_DIR, `sb_${task.name}_${vpName}.png`);
      await sbPage.screenshot({ path: sbPath });
      console.log(`    Captured Storybook: ${sbPath}`);

      // Interactions Sweeps
      if (task.interactions) {
        for (const inter of task.interactions) {
          if (inter.viewports.includes(vpName)) {
            console.log(`    Interaction Sweep: ${inter.name}`);
            
            // Reference site interaction
            await refPage.goto(task.refUrl, { waitUntil: 'networkidle' });
            await delay(1200);
            await inter.action(refPage, true);
            const refInterPath = path.join(VISUALS_DIR, `ref_${task.name}_${vpName}_${inter.name}.png`);
            await refPage.screenshot({ path: refInterPath });
            console.log(`      Captured Ref Interaction: ${refInterPath}`);

            // Storybook site interaction
            await sbPage.goto(task.sbUrl, { waitUntil: 'networkidle' });
            await delay(1200);
            await inter.action(sbPage, false);
            const sbInterPath = path.join(VISUALS_DIR, `sb_${task.name}_${vpName}_${inter.name}.png`);
            await sbPage.screenshot({ path: sbInterPath });
            console.log(`      Captured Storybook Interaction: ${sbInterPath}`);
          }
        }
      }
    }
  }

  await browser.close();
  console.log('\nAll Visual Comparisons and Interactive Crawler Sweeps Completed successfully!');
}

run().catch(err => {
  console.error('Fatal error running visual crawler:', err);
  process.exit(1);
});
