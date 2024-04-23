/**
 * Accessibility test suite
 *
 * Covers keyboard navigation for non-touch devices
 */
const { isRealMobileDevice } = require("../util");

describe("accessibility", () => {
  before(async () => {
    await browser.url("/");

    // Wait for orders to be loaded and displayed
    const ordersList = await $("[data-testid='orders-list']");
    expect(ordersList).toBeDisplayed();
  });

  !isRealMobileDevice() &&
    describe("keyboard navigation", () => {
      it("should focus on My Orders menu item when tabbing first time", async () => {
        // Tabs to the first menu item
        //
        // This bit can be flaky and possibly writing a utility to "tabUntil"
        // the desired element is focused could work more reliably. I've noticed
        // when this fails, it seems like the tab index is off by one.
        await browser.keys("Tab");
        const focused = browser.focused();

        expect(focused).toHaveHref("/orders");
        expect(focused).toHaveText("My Orders");
      });

      it("should focus on first order next", async () => {
        // This will focus on the first order in the list
        await browser.keys("Tab");
        const focused = browser.focused();

        expect(focused).toHaveTextContaining("Order #1001");
      });

      it("should navigate to order when selected with Enter key", async () => {
        // Hitting "enter" will activate the link
        await browser.keys("Enter");

        // Make sure we navigated to the right page
        expect(browser).toHaveUrl(
          new URL("orders/1001", browser.config.baseUrl).toString()
        );

        // Wait for any order data to load
        const title = await $("ion-title*=Order #1001");
        expect(title).toBeDisplayed();
      });

      it("should be able to focus on notification toggle", async () => {
        // Wait for Ionic page transition
        // without this, the test will be quite flaky
        await browser.pause(500);

        // Tabbing twice, once on the back button,
        // the next onto the toggle button
        await browser.keys(["Tab", "Tab"]);

        // Ensure the toggle button is what has focus
        const focused = browser.focused();
        expect(focused).toHaveAttribute(
          "aria-label",
          "Toggle Push Notifications"
        );
        expect(focused).toHaveAttribute("aria-checked", "false");
      });

      it("should be able to toggle notifications", async () => {
        await browser.keys("Enter");

        // A headless browser cannot show notifications, so we cannot toggle it to "true"
        // and rather than mock the whole Permissions Request sequence, all we need
        // to check is if the warn toast is shown, because the Enter key worked.
        if (browser.isHeadless()) {
          const toast = await $("ion-toast[data-presented");
          expect(toast).toBeDisplayed();
        } else {
          const focused = browser.focused();
          expect(focused).toHaveAttribute("aria-checked", "true");
        }
      });
    });
});
