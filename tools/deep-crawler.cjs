const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 900 }
};

const OUTPUT_DIR = path.resolve('C:/Users/ACER/.gemini/antigravity-ide/brain/64dbf582-628e-4aa3-87de-7b4ceb2b23a4/visuals/deep_crawl');
const DATA_FILE = path.join(OUTPUT_DIR, 'comparison_data.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Global registry for style comparison data
const styleComparisons = [];

// Helper to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper to extract computed style of an element
async function getComputedStyleOf(page, selector, description) {
  try {
    const element = page.locator(selector).first();
    if (await element.count() === 0) return null;
    
    return await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor || style.borderTopColor,
        borderRadius: style.borderRadius || style.borderTopLeftRadius,
        boxShadow: style.boxShadow,
        margin: `${style.marginTop} ${style.marginRight} ${style.marginBottom} ${style.marginLeft}`,
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
        display: style.display,
        position: style.position,
        zIndex: style.zIndex,
        opacity: style.opacity,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        top: `${rect.top}px`,
        left: `${rect.left}px`
      };
    });
  } catch (err) {
    console.warn(`[WARN] Failed to get computed style for ${selector} (${description}): ${err.message}`);
    return null;
  }
}

// Record style comparison
async function recordStyleDiff(refPage, sbPage, pageName, componentName, refSelector, sbSelector) {
  const refStyle = await getComputedStyleOf(refPage, refSelector, `Ref: ${componentName}`);
  const sbStyle = await getComputedStyleOf(sbPage, sbSelector, `SB: ${componentName}`);
  
  if (refStyle || sbStyle) {
    styleComparisons.push({
      pageName,
      componentName,
      refSelector,
      sbSelector,
      refStyle,
      sbStyle
    });
  }
}

// Drag helper simulating swipe gesture using Playwright mouse controls
async function dragGesture(page, dragSelector, xOffset, yOffset, description) {
  try {
    console.log(`      Dragging: ${description}...`);
    const element = page.locator(dragSelector).first();
    if (await element.count() === 0) {
      console.warn(`      [WARN] Drag target not found: ${dragSelector}`);
      return;
    }
    const box = await element.boundingBox();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + xOffset, startY + yOffset, { steps: 15 });
    await delay(300);
    await page.mouse.up();
    await delay(600); // Wait for transition animation
  } catch (err) {
    console.warn(`      [WARN] Drag failed: ${description} - ${err.message}`);
  }
}

// Safe click action helper
async function safeClick(page, selector, description) {
  try {
    console.log(`      Clicking: ${description}...`);
    const element = page.locator(selector).first();
    await element.waitFor({ state: 'visible', timeout: 5000 });
    await element.click();
    await delay(800); // Wait for transition
  } catch (err) {
    console.warn(`      [WARN] Click failed: ${description} (Selector: ${selector}) - ${err.message}`);
  }
}

async function captureScreen(page, screenshotName) {
  const filePath = path.join(OUTPUT_DIR, screenshotName);
  await page.screenshot({ path: filePath });
  console.log(`    Captured: ${screenshotName}`);
}

async function run() {
  console.log('=== STARTING DEEP INTERACTIVE CRAWLER AND ATTRIBUTE INSPECTOR ===');
  const browser = await chromium.launch({ headless: true });

  const refContext = await browser.newContext();
  const refPage = await refContext.newPage();
  
  const sbContext = await browser.newContext();
  const sbPage = await sbContext.newPage();

  // Setup Mock Login States on both
  const setupMockLogin = async (page, url) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('ciamik_is_logged_in', 'true');
      localStorage.setItem('ciamik_phone', '081234567890');
      localStorage.setItem('ciamik_user_name', 'Ahmad Maulana');
    });
    await delay(500);
  };

  console.log('Initializing login state...');
  await setupMockLogin(refPage, 'http://localhost:8081/halaman/storefront-home.html');
  await setupMockLogin(sbPage, 'http://localhost:6006/iframe.html?id=showcase-storefront-home--mobile&viewMode=story');

  // ==========================================
  // SECTION 1: STOREFRONT HOME (Mobile 375x812)
  // ==========================================
  console.log('\n--- CRAWLING STOREFRONT HOME ---');
  await refPage.setViewportSize(VIEWPORTS.mobile);
  await sbPage.setViewportSize(VIEWPORTS.mobile);

  const homeRefUrl = 'http://localhost:8081/halaman/storefront-home.html';
  const homeSbUrl = 'http://localhost:6006/iframe.html?id=showcase-storefront-home--mobile&viewMode=story';

  // State 1: Initial View
  await refPage.goto(homeRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(homeSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);

  await captureScreen(refPage, 'ref_home_01_initial.png');
  await captureScreen(sbPage, 'sb_home_01_initial.png');

  // Extract computed styles for categories, cards, searchbar
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Body font', 'body', 'body');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Header Bar', '.top-nav, header', '[class*="Topbar_container"], header');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Search Bar', '#search-input', 'input[placeholder*="cari"], input[placeholder*="Cari"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Category Chip', '.chip[data-filter="fashion"], .chip', 'button:has-text("Fashion"), button:has-text("Flash sale")');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Product Card', '.product-card:first-child', '[data-testid^="product-card-"], [class*="ProductCard_card"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Bottom Nav', 'nav.bottom-nav, .bottom-nav', 'nav[aria-label="Bottom Navigation"], [class*="BottomNav_container"]');

  // State 2: Click Category Chip
  await safeClick(refPage, '.chip[data-filter="fashion"]', 'Ref Category "Fashion"');
  await safeClick(sbPage, 'button:has-text("Fashion")', 'SB Category "Fashion"');
  await captureScreen(refPage, 'ref_home_02_category_active.png');
  await captureScreen(sbPage, 'sb_home_02_category_active.png');

  // State 3: Open Wishlist Bottom Sheet
  await refPage.goto(homeRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(homeSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await safeClick(refPage, '#navWishlist', 'Ref Open Wishlist');
  await safeClick(sbPage, 'nav[aria-label="Bottom Navigation"] button >> nth=1', 'SB Open Wishlist');
  await captureScreen(refPage, 'ref_home_03_wishlist_sheet.png');
  await captureScreen(sbPage, 'sb_home_03_wishlist_sheet.png');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Wishlist Sheet Backdrop', '.sheet-backdrop', '[class*="Sheet_backdrop"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Wishlist Sheet Content', '#wishlistSheet .sheet-content', '[class*="Sheet_content"]');

  // State 4: Open Cart Bottom Sheet
  await refPage.goto(homeRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(homeSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await safeClick(refPage, '#navCart', 'Ref Open Cart');
  await safeClick(sbPage, 'nav[aria-label="Bottom Navigation"] button >> nth=2', 'SB Open Cart');
  await captureScreen(refPage, 'ref_home_04_cart_sheet_half.png');
  await captureScreen(sbPage, 'sb_home_04_cart_sheet_half.png');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Cart Sheet Handle', '#cartSheet .sheet-handle', '[class*="handleContainer"]');

  // State 5: Drag Cart Sheet to Full Height
  await dragGesture(refPage, '#cartSheet .sheet-handle', 0, -250, 'Ref Drag Cart Sheet Up');
  await dragGesture(sbPage, '[class*="handleContainer"]', 0, -250, 'SB Drag Cart Sheet Up');
  await captureScreen(refPage, 'ref_home_05_cart_sheet_full.png');
  await captureScreen(sbPage, 'sb_home_05_cart_sheet_full.png');

  // State 6: Drag Cart Sheet Down to Dismiss
  await dragGesture(refPage, '#cartSheet .sheet-handle', 0, 400, 'Ref Dismiss Cart Sheet');
  await dragGesture(sbPage, '[class*="handleContainer"]', 0, 400, 'SB Dismiss Cart Sheet');
  await captureScreen(refPage, 'ref_home_06_cart_dismissed.png');
  await captureScreen(sbPage, 'sb_home_06_cart_dismissed.png');

  // State 7: Open Profile Sidebar Drawer
  await refPage.goto(homeRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(homeSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await safeClick(refPage, '#navProfile', 'Ref Open Profile');
  await safeClick(sbPage, 'nav[aria-label="Bottom Navigation"] button >> nth=3', 'SB Open Profile');
  await captureScreen(refPage, 'ref_home_07_profile_drawer.png');
  await captureScreen(sbPage, 'sb_home_07_profile_drawer.png');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Profile Sidebar Container', '#profileSidebar, .profile-sidebar', 'aside, [class*="Sidebar_sidebar"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_home', 'Profile Close Button', '#profileSidebar .close-btn, .profile-sidebar .close-btn', 'button[aria-label="Close"], button[class*="close"]');


  // ==========================================
  // SECTION 2: STOREFRONT PDP (Mobile 375x812)
  // ==========================================
  console.log('\n--- CRAWLING STOREFRONT PDP ---');
  const pdpRefUrl = 'http://localhost:8081/halaman/storefront-pdp.html?id=1';
  const pdpSbUrl = 'http://localhost:6006/iframe.html?id=showcase-storefront-pdp--mobile&viewMode=story';

  // State 1: PDP Initial View
  await refPage.goto(pdpRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(pdpSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await captureScreen(refPage, 'ref_pdp_01_initial.png');
  await captureScreen(sbPage, 'sb_pdp_01_initial.png');
  
  await recordStyleDiff(refPage, sbPage, 'storefront_pdp', 'Product Title', '.pdp-title, h1', 'h1, [class*="ProductPDP_title"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_pdp', 'Product Price', '.pdp-price, .price', '[class*="ProductPDP_price"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_pdp', 'Buy Box/CTA Bar', '.buying-box, .pdp-cta-bar', '[class*="ProductPDP_ctaBar"]');

  // State 2: Gallery Image Thumbnail Click
  await safeClick(refPage, '.thumb-list img >> nth=1', 'Ref Click Thumbnail 2');
  await safeClick(sbPage, '[class*="ProductPDP_thumbnail"] >> nth=1', 'SB Click Thumbnail 2');
  await captureScreen(refPage, 'ref_pdp_02_gallery_click.png');
  await captureScreen(sbPage, 'sb_pdp_02_gallery_click.png');

  // State 3: Open Variants/Buy Sheet
  await refPage.goto(pdpRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(pdpSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  // Trigger Buy Now/Beli Langsung to open variants selection sheet
  await safeClick(refPage, '#pdpBuyNowBtn, #btnBuyNow, button.checkout-btn', 'Ref Beli Langsung');
  await safeClick(sbPage, 'button:has-text("Beli Langsung")', 'SB Beli Langsung');
  await captureScreen(refPage, 'ref_pdp_03_variants_sheet.png');
  await captureScreen(sbPage, 'sb_pdp_03_variants_sheet.png');

  await recordStyleDiff(refPage, sbPage, 'storefront_pdp', 'Variant Chip (Active)', '#pdpColors .v-chip.active, .v-chip.active', 'button[class*="active"], [class*="VariantChip_active"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_pdp', 'Quantity Selector Row', '.pdp-qty-selector', '[class*="QuantitySelector"]');

  // State 4: Increment Quantity
  await safeClick(refPage, '#pdpQtyPlus', 'Ref Increment Quantity');
  await safeClick(sbPage, 'button:has-text("+"), [class*="QuantitySelector"] button >> nth=1', 'SB Increment Quantity');
  await captureScreen(refPage, 'ref_pdp_04_qty_increment.png');
  await captureScreen(sbPage, 'sb_pdp_04_qty_increment.png');


  // ==========================================
  // SECTION 3: STOREFRONT CHECKOUT (Mobile 375x812)
  // ==========================================
  console.log('\n--- CRAWLING STOREFRONT CHECKOUT ---');
  const checkoutRefUrl = 'http://localhost:8081/halaman/storefront-checkout.html';
  const checkoutSbUrl = 'http://localhost:6006/iframe.html?id=showcase-storefront-checkout--mobile&viewMode=story';

  // State 1: Checkout Initial View
  await refPage.goto(checkoutRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(checkoutSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await captureScreen(refPage, 'ref_checkout_01_initial.png');
  await captureScreen(sbPage, 'sb_checkout_01_initial.png');

  await recordStyleDiff(refPage, sbPage, 'storefront_checkout', 'Courier Option Card', '.courier-card:first-child', '[class*="CourierCard"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_checkout', 'Payment Option Card', '.payment-card:first-child', '[class*="PaymentCard"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_checkout', 'Address Card Box', '.address-box', '[class*="AddressBox"]');

  // State 2: Open Address Selector Modal/Sheet
  await safeClick(refPage, '#btnEditAddress, button:has-text("Ubah")', 'Ref Edit Address');
  await safeClick(sbPage, 'button:has-text("Ubah")', 'SB Edit Address');
  await captureScreen(refPage, 'ref_checkout_02_address_sheet.png');
  await captureScreen(sbPage, 'sb_checkout_02_address_sheet.png');

  // State 3: Close Address sheet & Trigger Payment Select
  await refPage.goto(checkoutRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(checkoutSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await safeClick(refPage, '.payment-card >> nth=1', 'Ref Click 2nd Payment Option');
  await safeClick(sbPage, '[class*="PaymentCard"] >> nth=1', 'SB Click 2nd Payment Option');
  await captureScreen(refPage, 'ref_checkout_03_payment_selected.png');
  await captureScreen(sbPage, 'sb_checkout_03_payment_selected.png');

  // State 4: Click Pay Now to Trigger OTP
  await safeClick(refPage, '#btnPlaceOrder, button:has-text("Bayar")', 'Ref Bayar Sekarang');
  await safeClick(sbPage, 'button:has-text("Bayar Sekarang")', 'SB Bayar Sekarang');
  await captureScreen(refPage, 'ref_checkout_04_otp_initial.png');
  await captureScreen(sbPage, 'sb_checkout_04_otp_initial.png');
  
  await recordStyleDiff(refPage, sbPage, 'storefront_checkout', 'OTP Form Box', '.otp-container', '[class*="OTPFlow_container"]');
  await recordStyleDiff(refPage, sbPage, 'storefront_checkout', 'OTP Submit CTA', '.otp-cta', 'button[type="submit"], [class*="OTPFlow_ctaBtn"]');

  // State 5: Trigger Send Code (Verify Spinner Loading)
  await safeClick(refPage, '.otp-cta', 'Ref Send Code');
  await safeClick(sbPage, 'button:has-text("Kirim Kode Verifikasi")', 'SB Send Code');
  // Capture loading/spinner state quickly
  await captureScreen(refPage, 'ref_checkout_05_otp_loading.png');
  await captureScreen(sbPage, 'sb_checkout_05_otp_loading.png');


  // ==========================================
  // SECTION 4: BACKOFFICE DASHBOARD (Desktop 1280x900)
  // ==========================================
  console.log('\n--- CRAWLING BACKOFFICE DASHBOARD ---');
  await refPage.setViewportSize(VIEWPORTS.desktop);
  await sbPage.setViewportSize(VIEWPORTS.desktop);

  const dashRefUrl = 'http://localhost:8081/halaman/backoffice/dashboard.html';
  const dashSbUrl = 'http://localhost:6006/iframe.html?id=showcase-backoffice-dashboard--desktop&viewMode=story';

  // State 1: Dashboard View
  await refPage.goto(dashRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(dashSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await captureScreen(refPage, 'ref_dash_01_initial.png');
  await captureScreen(sbPage, 'sb_dash_01_initial.png');

  await recordStyleDiff(refPage, sbPage, 'backoffice_dashboard', 'Dashboard Header', '.header', '[class*="Topbar_container"], header');
  await recordStyleDiff(refPage, sbPage, 'backoffice_dashboard', 'Sidebar Navigation', '.sidebar', 'aside, [class*="Sidebar_sidebar"]');
  await recordStyleDiff(refPage, sbPage, 'backoffice_dashboard', 'Loading Bar', '#loading-bar', '[id*="loading-bar"], [class*="LoadingBar"]');
  await recordStyleDiff(refPage, sbPage, 'backoffice_dashboard', 'Dashboard Metric Card', '#mc-revenue', '[class*="MetricCard_card"] >> nth=0');
  await recordStyleDiff(refPage, sbPage, 'backoffice_dashboard', 'ECharts Area Grid', '#revenue-chart', '[id*="revenue-chart"], [class*="chart"]');

  // State 2: Trigger Loading Bar manually (Ref uses showLoading() in console, SB? We'll see if it has a way or just check how it looks)
  await refPage.evaluate(() => {
    if (typeof showLoading === 'function') showLoading();
  });
  await captureScreen(refPage, 'ref_dash_02_loading_bar_active.png');
  await refPage.evaluate(() => {
    if (typeof hideLoading === 'function') hideLoading();
  });

  // State 3: Period Range Selector Click
  await safeClick(refPage, '#date-range-picker, button:has-text("Periode"), .date-picker-trigger', 'Ref Open Period Selector');
  await safeClick(sbPage, 'button[class*="DateRangePicker_trigger"], button:has-text("Hari terakhir"), button:has-text("Periode")', 'SB Open Period Selector');
  await captureScreen(refPage, 'ref_dash_03_period_selector.png');
  await captureScreen(sbPage, 'sb_dash_03_period_selector.png');

  // State 4: Click Metric Card for Right Detail Pane Drilldown
  await refPage.goto(dashRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(dashSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await safeClick(refPage, '#mc-revenue, .metric-card >> nth=0', 'Ref Click Revenue Metric Card');
  await safeClick(sbPage, 'text=/Revenue/i, [class*="MetricCard_card"] >> nth=0', 'SB Click Revenue Metric Card');
  await captureScreen(refPage, 'ref_dash_04_revenue_drilldown.png');
  await captureScreen(sbPage, 'sb_dash_04_revenue_drilldown.png');

  await recordStyleDiff(refPage, sbPage, 'backoffice_dashboard', 'Detail Pane Drilldown', '#detail-pane', '[class*="DetailPane_container"]');


  // ==========================================
  // SECTION 5: BACKOFFICE ORDERS (Desktop 1280x900)
  // ==========================================
  console.log('\n--- CRAWLING BACKOFFICE ORDERS ---');
  const ordRefUrl = 'http://localhost:8081/halaman/backoffice/orders.html';
  const ordSbUrl = 'http://localhost:6006/iframe.html?id=showcase-backoffice-orders--desktop&viewMode=story';

  // State 1: Orders Table Initial View
  await refPage.goto(ordRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(ordSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await captureScreen(refPage, 'ref_orders_01_table.png');
  await captureScreen(sbPage, 'sb_orders_01_table.png');

  await recordStyleDiff(refPage, sbPage, 'backoffice_orders', 'Data Table Layout', 'table.data-table', 'table[class*="DataTable_table"]');
  await recordStyleDiff(refPage, sbPage, 'backoffice_orders', 'View Switcher Container', '.view-switcher', '[class*="ViewSwitcher_container"]');
  await recordStyleDiff(refPage, sbPage, 'backoffice_orders', 'KPI Status Row', '.metric-grid', '[class*="Orders_kpiGrid"]');

  // State 2: Click Row to Open Detail Pane
  await safeClick(refPage, 'table.data-table tbody tr:first-child', 'Ref Click Order Row');
  await safeClick(sbPage, 'table[class*="DataTable_table"] tbody tr:first-child, [class*="DataTable_table"] tbody tr >> nth=0', 'SB Click Order Row');
  await captureScreen(refPage, 'ref_orders_02_row_detail.png');
  await captureScreen(sbPage, 'sb_orders_02_row_detail.png');

  // State 3: Switch to List View
  await refPage.goto(ordRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(ordSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await safeClick(refPage, '.view-btn[data-view="list"]', 'Ref Switch to List');
  await safeClick(sbPage, 'button:has-text("List"), button[class*="ViewSwitcher"] >> nth=1', 'SB Switch to List');
  await captureScreen(refPage, 'ref_orders_03_list_view.png');
  await captureScreen(sbPage, 'sb_orders_03_list_view.png');

  // State 4: Switch to Cards View
  await safeClick(refPage, '.view-btn[data-view="cards"]', 'Ref Switch to Cards');
  await safeClick(sbPage, 'button:has-text("Cards"), button[class*="ViewSwitcher"] >> nth=2', 'SB Switch to Cards');
  await captureScreen(refPage, 'ref_orders_04_cards_view.png');
  await captureScreen(sbPage, 'sb_orders_04_cards_view.png');

  // State 5: Switch to Kanban View
  await safeClick(refPage, '.view-btn[data-view="kanban"]', 'Ref Switch to Kanban');
  await safeClick(sbPage, 'button:has-text("Kanban"), button[class*="ViewSwitcher"] >> nth=3', 'SB Switch to Kanban');
  await captureScreen(refPage, 'ref_orders_05_kanban_view.png');
  await captureScreen(sbPage, 'sb_orders_05_kanban_view.png');

  await recordStyleDiff(refPage, sbPage, 'backoffice_orders', 'Kanban Column Wrapper', '.kanban-col:first-child', '[class*="KanbanBoard_column"] >> nth=0');
  await recordStyleDiff(refPage, sbPage, 'backoffice_orders', 'Kanban Board Card', '.kanban-card:first-child', '[data-testid^="kanban-card-"] >> nth=0');

  // State 6: Drag Kanban Card (Ref: Baru -> Proses, SB: custom drag-drop test)
  await dragGesture(refPage, '.kanban-card:first-child', 220, 0, 'Ref Drag Kanban Card to Next Column');
  await dragGesture(sbPage, '[data-testid^="kanban-card-"] >> nth=0', 220, 0, 'SB Drag Kanban Card to Next Column');
  await captureScreen(refPage, 'ref_orders_06_kanban_dragged.png');
  await captureScreen(sbPage, 'sb_orders_06_kanban_dragged.png');


  // ==========================================
  // SECTION 6: BACKOFFICE FULFILLMENT (Desktop 1280x900)
  // ==========================================
  console.log('\n--- CRAWLING BACKOFFICE FULFILLMENT ---');
  const fulRefUrl = 'http://localhost:8081/halaman/backoffice/fulfillment.html';
  const fulSbUrl = 'http://localhost:6006/iframe.html?id=showcase-backoffice-fulfillment--desktop&viewMode=story';

  await refPage.goto(fulRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(fulSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await captureScreen(refPage, 'ref_fulfillment_01_initial.png');
  await captureScreen(sbPage, 'sb_fulfillment_01_initial.png');

  // Click card to open detail pane
  await safeClick(refPage, '.kanban-card:first-child', 'Ref Click Fulfillment Card');
  await safeClick(sbPage, '[class*="draggableCardWrapper"] >> nth=0', 'SB Click Fulfillment Card');
  await captureScreen(refPage, 'ref_fulfillment_02_card_detail.png');
  await captureScreen(sbPage, 'sb_fulfillment_02_card_detail.png');


  // ==========================================
  // SECTION 7: BACKOFFICE CATALOG (Desktop 1280x900)
  // ==========================================
  console.log('\n--- CRAWLING BACKOFFICE CATALOG ---');
  const catRefUrl = 'http://localhost:8081/halaman/backoffice/catalog-products.html';
  const catSbUrl = 'http://localhost:6006/iframe.html?id=showcase-backoffice-catalog--desktop&viewMode=story';

  await refPage.goto(catRefUrl, { waitUntil: 'networkidle' });
  await sbPage.goto(catSbUrl, { waitUntil: 'networkidle' });
  await delay(1200);
  await captureScreen(refPage, 'ref_catalog_01_initial.png');
  await captureScreen(sbPage, 'sb_catalog_01_initial.png');

  // Trigger Add Product Modal
  await safeClick(refPage, 'button:has-text("Tambah Produk")', 'Ref Click Tambah Produk');
  await safeClick(sbPage, 'button:has-text("Tambah Produk")', 'SB Click Tambah Produk');
  await captureScreen(refPage, 'ref_catalog_02_add_modal.png');
  await captureScreen(sbPage, 'sb_catalog_02_add_modal.png');

  await recordStyleDiff(refPage, sbPage, 'backoffice_catalog', 'Add Product Modal Box', '#modal-add-product .modal-content, .modal-content', '[role="dialog"], [class*="Modal_content"]');

  // Write out the comparison JSON data
  fs.writeFileSync(DATA_FILE, JSON.stringify(styleComparisons, null, 2), 'utf-8');
  console.log(`\nCSS Computed Style differences saved to: ${DATA_FILE}`);

  await browser.close();
  console.log('=== DEEP CRAWLER AND COMPARATIVE INSPECTOR COMPLETED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Fatal error running deep visual crawler:', err);
  process.exit(1);
});
