module.exports = {
  /**
   * Whether or not the requested device is a real mobile device
   *
   * @returns {Boolean}
   */
  isRealMobileDevice() {
    return !!browser.requestedCapabilities.real_mobile;
  },

  /**
   * Whether or not the requested device is running Android Chrome
   * @returns {Boolean}
   */
  isAndroidChrome() {
    return browser.requestedCapabilities.browserName === "Android";
  },

  /**
   * Whether or not the requested device is a specific physical device
   *
   * @param {String} device The BrowserStack device name
   * @returns {Boolean}
   */
  isDevice(device) {
    return browser.requestedCapabilities.device === device;
  },

  /**
   * Whether or not the device is using the given orientation
   *
   * @param {"landscape" | "portrait"} orientation The orientation to compare, one of "landscape" or "portrait"
   * @returns {Boolean}
   */
  isDeviceOrientation(orientation) {
    return browser.requestedCapabilities.deviceOrientation === orientation;
  },
};
