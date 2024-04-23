/**
 * Mobile notifications test suite
 *
 * Covers testing notifications on Android Chrome, since iOS
 * doesn't support notifications. This suite could be enhanced
 * to test on Mac OS Safari, since notifications do work there.
 */
const { isAndroidChrome } = require("../util");

describe("notifications", () => {
  // Only execute this test on Android Chrome, since
  // we switch to the NATIVE_APP context
  isAndroidChrome() &&
    it("should show notification on Android Chrome", async () => {
      // Browse directly to the order detail page
      await browser.url("/orders/1001");

      // Grab the notification toggle by its ARIA label and toggle it
      const notificationToggle = await $(
        "[aria-label='Toggle Push Notifications']"
      );
      expect(notificationToggle).toHaveAttr("aria-checked", "false");
      await notificationToggle.click();

      // A native prompt is being shown, so we have to
      // switch contexts
      const webCtx = await browser.getContext();
      await browser.switchContext("NATIVE_APP");

      // Grab the Allow button by XPath syntax
      const allowButton = await $("//android.widget.Button[@text='Allow']");
      await allowButton.click();

      // Switch back to the original CHROMIUM web context
      await browser.switchContext(webCtx);

      // The toggle should be enabled
      expect(notificationToggle).toHaveAttr("aria-checked", "true");

      // Wait until the order status changes. This works because
      // for Android Chrome we use ServiceWorkerRegistration.showNotification
      // as local notifications don't work. If the order status changes,
      // the notification was successful otherwise it throws an error
      // preventing the status from changing.
      await browser.waitUntil(
        async () => {
          const orderStatus = await $("ion-card-title[role='heading']");

          return orderStatus.getText() === "shipped";
        },
        { timeout: 30000 }
      );
    });
});
