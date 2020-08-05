module.exports = {
  isRealMobileDevice() {
    return !!browser.requestedCapabilities.realMobile;
  },
  isAndroidDevice() {
    return !!browser.requestedCapabilities.browserName === "Android";
  },
};
