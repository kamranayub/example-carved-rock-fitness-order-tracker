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
const { get } = require("lodash");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on("before:browser:launch", (browser = {}, launchOptions = {}) => {
    const PERMISSIONS = {
      ASK: 0,
      ALLOW: 1,
      BLOCK: 2,
    };

    const permissions = {
      notifications: Number(
        get(config.env, "prefs_notifications", PERMISSIONS.ALLOW)
      ),
      geolocation: Number(
        get(config.env, "prefs_geolocation", PERMISSIONS.ALLOW)
      ),
    };

    browser.prefs = {
      ...browser.prefs,
      ...permissions,
    };

    if (browser.family === "chromium" && browser.name !== "electron") {
      // Set launch options
      launchOptions.preferences = {
        ...launchOptions.preferences,
        default: {
          ...launchOptions.preferences.default,
          profile: {
            ...launchOptions.preferences.default.profile,
            managed_default_content_settings: {
              ...launchOptions.preferences.default.profile
                .managed_default_content_settings,
              ...permissions,
            },
          },
        },
      };
      return launchOptions;
    }
  });
};
