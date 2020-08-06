const { isRealMobileDevice } = require("../util");

describe("accessibility", () => {
  before(() => {
    browser.url("/");
    const ordersList = $("[data-testid='orders-list']");
    expect(ordersList).toBeDisplayed();
  });

  !isRealMobileDevice() &&
    describe("keyboard navigation", () => {
      it("should focus on My Orders menu item when tabbing first time", () => {
        browser.keys("Tab");
        const focused = browser.focused();

        expect(focused).toHaveHref("/orders");
        expect(focused).toHaveText("My Orders");
      });

      it("should focus on first order next", () => {
        browser.keys("Tab");
        const focused = browser.focused();

        expect(focused).toHaveTextContaining("Order #1001");
      });

      it("should navigate to order when selected with Enter key", () => {
        browser.keys("Enter");
        expect(browser).toHaveUrl(
          new URL("orders/1001", browser.config.baseUrl).toString()
        );
        const title = $("ion-title*=Order #1001");
        expect(title).toBeDisplayed();
      });

      it("should be able to focus on notification toggle", () => {
        browser.pause(500); // wait for Ionic page transition
        browser.keys(["Tab", "Tab"]);
        const focused = browser.focused();
        expect(focused).toHaveAttribute(
          "aria-label",
          "Toggle Push Notifications"
        );
        expect(focused).toHaveAttribute("aria-checked", "false");
      });

      it("should be able to toggle notifications", () => {
        browser.keys("Enter");

        // A headless browser cannot show notifications, so we cannot toggle it to "true"
        // and rather than mock the whole Permissions Request sequence, all we need
        // to check is if the warn toast is shown, because the Enter key worked.
        if (browser.isHeadless()) {
          const toast = $("ion-toast[data-presented");
          expect(toast).toBeDisplayed();
        } else {
          const focused = browser.focused();
          expect(focused).toHaveAttribute("aria-checked", "true");
        }
      });
    });
});
