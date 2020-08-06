const merge = require("deepmerge");
const wdioConf = require("./wdio.conf");

exports.config = merge(
  wdioConf.config,
  {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    services: ["browserstack"],
  },
  { clone: false }
);

// Override browser capabilities
// We could add Chrome desktop here as well,
// but this is an example of running separate real devices
// in BS
const common = {
  project: "Carved Rock Fitness Order Tracker",
  buildName: process.env.GITHUB_RUN_ID
    ? `GitHub ${process.env.GITHUB_WORKFLOW} / ${process.env.GITHUB_RUN_ID}.${process.env.GITHUB_RUN_NUMBER}`
    : "Local",
};
exports.config.capabilities = [
  {
    browserName: "Safari",
    device: "iPhone 11",
    real_mobile: "true",
    os_version: "13",
    deviceOrientation: "landscape",

    name: "iPhone 11 (landscape)",
    ...common,
  },
  {
    browserName: "Android",
    device: "Google Pixel 4",
    real_mobile: "true",
    os_version: "11.0",

    name: "Pixel 4",
    project: "Carved Rock Fitness Order Tracker",
    ...common,
  },
];
