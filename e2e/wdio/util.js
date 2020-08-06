module.exports = {
  isRealMobileDevice() {
    return !!browser.requestedCapabilities.real_mobile;
  },
  isAndroidDevice() {
    return browser.requestedCapabilities.browserName === "Android";
  },
};
