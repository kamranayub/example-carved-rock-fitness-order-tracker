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
exports.config.capabilities = [
  {
    browserName: "Safari",
    device: "iPhone 11",
    realMobile: "true",
    os_version: "13",
    deviceOrientation: "landscape",

    name: "iPhone 11 (landscape)",
    project: "Carved Rock Fitness Order Tracker",
    buildName: process.env.GITHUB_RUN_ID
      ? `GitHub ${GITHUB_WORKFLOW} / ${process.env.GITHUB_RUN_ID}.${process.env.GITHUB_RUN_NUMBER}`
      : "Local",
  },
];
