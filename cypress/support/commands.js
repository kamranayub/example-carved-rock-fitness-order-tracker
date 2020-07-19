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

Cypress.Commands.overwrite("visit", (originalFn, path, options = {}) => {
  if (options.useSw) {
    return originalFn(path, options);
  }

  // Bypass SW caching for index.html routes
  return originalFn(path, {
    ...options,
    qs: { ...options.qs, cy_sw_bypass: true },
  });
});

Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((window) => {
    window.sessionStorage.clear();
  });
});

Cypress.Commands.add("waitForCacheStorage", (cacheName, options = {}) => {
  cy.window()
    .its("caches")
    .should(async (caches) => {
      const hasCache = await caches.has(cacheName);
      expect(hasCache).to.be.true;

      if (options.minimumCacheEntries) {
        const cache = await caches.open(cacheName);
        const cacheEntries = await cache.keys();
        expect(cacheEntries).to.have.length.gte(options.minimumCacheEntries);
      }

      if (options.maximumCacheEntries) {
        const cache = await caches.open(cacheName);
        const cacheEntries = await cache.keys();
        expect(cacheEntries).to.have.length.lte(options.maximumCacheEntries);
      }
    });
});

Cypress.Commands.add("clearCacheStorage", (cacheName) => {
  cy.window()
    .its("caches")
    .should(async (caches) => {
      const hasCache = await caches.has(cacheName);

      if (hasCache) {
        const hasDeleted = await caches.delete(cacheName);

        expect(hasDeleted).to.be.true;
      }
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
  cy.findByTestId("orders-list", {
    timeout: Cypress.config().pageLoadTimeout,
  }).should("be.visible");
});
