module.exports = {
  isRealMobileDevice() {
    return !!browser.requestedCapabilities.real_mobile;
  },
  isAndroidChrome() {
    return browser.requestedCapabilities.browserName === "Android";
  },
  isDevice(device) {
    return browser.requestedCapabilities.device === device;
  },
  isDeviceOrientation(orientation) {
    return browser.requestedCapabilities.deviceOrientation === orientation;
  },
};
