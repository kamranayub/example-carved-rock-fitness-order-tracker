describe("accessibility", () => {
  before(async () => {
    await browser.url("/");
    const firstOrder = await $("ion-item*=Order #1001");
    await expect(firstOrder).toBeDisplayed();
  });

  describe("keyboard navigation", () => {
    it("should focus on My Orders menu item when tabbing first time", async () => {
      await browser.keys("Tab");
      const focused = await browser.focused();

      await expect(focused).toHaveHref("/orders");
      await expect(focused).toHaveText("My Orders");
    });

    it("should focus on first order next", async () => {
      await browser.keys("Tab");
      const focused = await browser.focused();

      await expect(focused).toHaveTextContaining("Order #1001");
    });

    it("should navigate to order when selected with Enter key", async () => {
      await browser.keys("Enter");
      await expect(browser).toHaveUrl(
        new URL("orders/1001", browser.config.baseUrl).toString()
      );
      const title = await $("ion-title*=Order #1001");
      await expect(title).toBeDisplayed();
      await browser.pause(500); // wait for Ionic page transition
    });

    it("should be able to focus on notification toggle", async () => {
      await browser.keys(["Tab", "Tab"]);
      const focused = await browser.focused();
      await expect(focused).toHaveAttribute(
        "aria-label",
        "Toggle Push Notifications"
      );
      await expect(focused).toHaveAttribute("aria-checked", "false");
    });

    it("should be able to toggle notifications", async () => {
      await browser.keys("Enter");

      // A headless browser cannot show notifications, so we cannot toggle it to "true"
      // and rather than mock the whole Permissions Request sequence, all we need
      // to check is if the warn toast is shown, because the Enter key worked.
      if (browser.isHeadless()) {
        const toast = await $("ion-toast:not(.overlay-hidden)");
        await expect(toast).toBeDisplayed();
      } else {
        const focused = await browser.focused();
        await expect(focused).toHaveAttribute("aria-checked", "true");
      }
    });
  });
});
