const { isAndroidChrome } = require("../util");

describe("notifications", () => {
  isAndroidChrome() &&
    it("should show notification on Android Chrome", () => {
      browser.url("/orders/1001");
      const notificationToggle = $("[aria-label='Toggle Push Notifications']");

      expect(notificationToggle).toHaveAttr("aria-checked", "false");

      notificationToggle.click();

      const webCtx = browser.getContext();
      browser.switchContext("NATIVE_APP");

      const allowButton = $("//android.widget.Button[@text='Allow']");
      allowButton.click();

      browser.switchContext(webCtx);

      expect(notificationToggle).toHaveAttr("aria-checked", "true");

      browser.waitUntil(
        () => {
          const orderStatus = $("ion-card-title[role='heading']");

          return orderStatus.getText() === "shipped";
        },
        { timeout: 30000 }
      );
    });
});
