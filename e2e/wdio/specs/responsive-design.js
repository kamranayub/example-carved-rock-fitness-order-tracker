/**
 * Responsive design for specific devices
 *
 * This covers the iPhone 11 "notch" test case. We could add more coverage
 * or even visual testing (see Percy, from BrowserStack) to enhance this further.
 */
const { isDevice, isDeviceOrientation } = require("../util");

describe("responsive design", () => {
  it("should load the homepage with order data", () => {
    browser.url("/");
    const ordersList = $("[data-testid='orders-list']");
    expect(ordersList).toBeDisplayed();
  });

  // Only run this test in Safari on iPhone 11
  // though we could be more robust and write a function
  // to return what devices might have the notch
  isDevice("iPhone 11") &&
    isDeviceOrientation("landscape") &&
    it("should move content over to account for notch in landscape mode", () => {
      // Ionic will have a safe area variable set to the value
      // of `env(safe-area-inset-left)` when running in iPhone 11 Safari
      // to adjust for the notch when viewport-fit=cover is applied
      const ionSafeAreaLeft = browser.execute(() =>
        getComputedStyle(document.querySelector("html")).getPropertyValue(
          "--ion-safe-area-left"
        )
      );

      // The value should be a pixel offset (I saw 44px)
      // Using Regex to not break the test if the offset is adjusted
      // for different devices, we just care that it has a pixel value
      expect(ionSafeAreaLeft).toMatch(/\d+px/);
    });
});
