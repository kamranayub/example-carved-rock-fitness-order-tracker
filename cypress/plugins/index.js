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
const { set, unset, chain, toNumber, forOwn } = require("lodash");

function isChromePrefEnvVar(_value, key) {
  return key.startsWith("chromePreferences__");
}

function transformPrefEnvVarToPropertyPath(_value, key) {
  return key.replace("chromePreferences__", "").replace(/__/gi, ".");
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === "chromium" && browser.name !== "electron") {
      // Allow overriding prefs via dynamic env variables
      const chromePreferences = chain(config.env)
        .pickBy(isChromePrefEnvVar)
        .mapKeys(transformPrefEnvVarToPropertyPath)
        .mapValues(toNumber)
        .value();

      // By default, unset preferences Cypress doesn't set automatically
      unset(
        launchOptions,
        "preferences.default.profile.managed_default_content_settings"
      );

      // Set Chrome launchOptions preferences
      forOwn(chromePreferences, (value, path) => {
        set(launchOptions, `preferences.default.${path}`, value);
      });

      return launchOptions;
    }
  });
};
