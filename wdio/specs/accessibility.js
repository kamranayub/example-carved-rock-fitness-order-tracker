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
      await expect(browser).toHaveUrl(browser.config.baseUrl + "orders/1001");
      const title = await $("ion-title*=Order #1001");
      await expect(title).toBeDisplayed();
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
      const focused = await browser.focused();
      await expect(focused).toHaveAttribute(
        "aria-label",
        "Toggle Push Notifications"
      );
      await expect(focused).toHaveAttribute("aria-checked", "true");
    });
  });
});
