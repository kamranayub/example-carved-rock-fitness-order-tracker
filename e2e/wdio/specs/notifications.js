const { isAndroidDevice } = require("../util");

describe("notifications", () => {
  isAndroidDevice() &&
    it("should show notification on Android Chrome", () => {
      browser.url("/orders/1001");
      const notificationToggle = $("[aria-label='Toggle Order Notifications']");

      expect(notificationToggle).toHaveAttr("aria-checked", "false");

      notificationToggle.click();

      const webCtx = browser.getContext();
      browser.switchContext("NATIVE_APP");

      const allowButton = $("android.widget.Button=Allow");
      allowButton.click();

      browser.switchContext(webCtx);

      expect(notificationToggle).toHaveAttr("aria-checked", "true");
    });
});
