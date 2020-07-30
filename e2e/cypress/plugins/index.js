/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const {
  cypressBrowserPermissionsPlugin,
} = require("cypress-browser-permissions");
const cypressRetryPlugin = require("cypress-plugin-retries/lib/plugin");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Enable browser permissions
  config = cypressBrowserPermissionsPlugin(on, config);

  // Enable retry logging
  cypressRetryPlugin(on);

  // Customize Firefox launch preferences in CI
  if (process.env.CI) {
    on("before:browser:launch", (browser, launchOptions) => {
      if (browser.family === "firefox") {
        console.log("Setting FF viewport to 2560x1440");
        launchOptions.args.push("--width=2560");
        launchOptions.args.push("--height=1440");
      }
    });
  }
  return config;
};
