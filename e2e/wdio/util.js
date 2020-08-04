module.exports = {
  isRealMobileDevice() {
    return !!browser.requestedCapabilities.realMobile;
  },
};
