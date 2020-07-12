// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

Cypress.Commands.overwrite("visit", (originalFn, path, options) => {
  // Bypass SW caching for index.html routes
  // WARN: This doesn't handle if path already contains a query!
  return originalFn(path + "?sw_bypass", options);
});

Cypress.Commands.overwrite("viewport", (originalFn, ...args) => {
  // Delegate to original fn
  originalFn(...args);

  // Seems to be needed in 4.9.0 for a split second
  cy.wait(500);
});

Cypress.Commands.add("waitForIonicAnimations", () => {
  cy.wait(300);
});

Cypress.Commands.add("triggerBeforeInstallEvent", () => {
  cy.wait(1000);
  cy.window().then((window) => {
    const beforeInstallPromptEvent = new Event("beforeinstallprompt");
    window.dispatchEvent(beforeInstallPromptEvent);
  });
});

Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((window) => {
    window.sessionStorage.clear();
  });
});

Cypress.Commands.add("online", () => {
  cy.window().then((window) => {
    const onlineEvent = new Event("online");
    window.dispatchEvent(onlineEvent);
  });
});

Cypress.Commands.add("offline", () => {
  cy.window().then((window) => {
    const offlineEvent = new Event("offline");
    window.dispatchEvent(offlineEvent);
  });
});

Cypress.Commands.add("visitWithoutApiCaching", (url, options = {}) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      options.onBeforeLoad && options.onBeforeLoad(win);
      win.__CY_DISABLE_SW_API_CACHING = true;
    },
  });
});

Cypress.Commands.add("waitForAppReadiness", () => {
  cy.findByText("Order #1001").should("be.visible");
});
