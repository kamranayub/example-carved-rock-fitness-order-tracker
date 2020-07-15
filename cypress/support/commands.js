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
  if (options && options.useSw) {
    return originalFn(path, options);
  }

  // Bypass SW caching for index.html routes
  // WARN: This doesn't handle if path already contains a query!
  return originalFn(path + "?sw_bypass", options);
});

Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((window) => {
    window.sessionStorage.clear();
  });
});

Cypress.Commands.add(
  "triggerEvent",
  { prevSubject: "window" },
  (win, eventName, eventInit = undefined) => {
    const event = new Event(eventName, eventInit);
    win.dispatchEvent(event);
  }
);

Cypress.Commands.add("waitForIonicAnimations", () => {
  cy.wait(Cypress.env().ionicAnimationTimeout);
});

/**
 * Waits for initial orders to load from backend
 */
Cypress.Commands.add("waitForAppReadiness", () => {
  cy.findByText("Order #1001", {
    timeout: Cypress.config().pageLoadTimeout,
  }).should("be.visible");
});
