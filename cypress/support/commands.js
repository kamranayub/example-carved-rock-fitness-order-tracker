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

Cypress.Commands.add("unregisterServiceWorkers", () => {
  if ("serviceWorker" in navigator) {
    cy.wrap(
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((reg) => reg.unregister()))
        )
    );
  }
});
