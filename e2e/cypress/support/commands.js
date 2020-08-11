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

/**
 * Overwritten visit command that handles sending the correct querystring
 * flags to bypass parts of service worker caching during tests. If the visited
 * page is served by a service worker, Cypress is unable to stub or spy on
 * window APIs or XHR requests so it's important to default for all visit requests.
 */
Cypress.Commands.overwrite("visit", (originalFn, path, options = {}) => {
  if (options.useSw) {
    // Bypass SW caching for ONLY document routes (i.e. API route will be cached)
    return originalFn(path, {
      ...options,
      qs: { ...options.qs, cy_sw_page_only_bypass: true },
    });
  }

  // Bypass SW caching for all document and API route
  return originalFn(path, {
    ...options,
    qs: { ...options.qs, cy_sw_bypass: true },
  });
});

/**
 * Clears the window.sessionStorage store
 */
Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((window) => {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
  });
});

/**
 * Waits for window.caches to contain the given cache name, and
 * will wait for a min or max number of entries before proceeding
 */
Cypress.Commands.add("waitForCacheStorage", (cacheName, options = {}) => {
  cy.window()
    .its("caches")
    .should(async (caches) => {
      if (!caches) {
        return;
      }

      const cache = await caches.open(cacheName);
      expect(cache).to.exist;

      if ("minimumCacheEntries" in options) {
        const cacheEntries = await cache.keys();
        expect(cacheEntries).to.have.length.gte(options.minimumCacheEntries);
      }

      if ("maximumCacheEntries" in options) {
        const cacheEntries = await cache.keys();
        expect(cacheEntries).to.have.length.lte(options.maximumCacheEntries);
      }
    });
});

/**
 * Clears a window.caches storage by name and waits for it to be deleted
 * completely.
 */
Cypress.Commands.add("clearCacheStorage", (cacheName) => {
  cy.window()
    .its("caches")
    .should(async (caches) => {
      if (!caches) {
        return;
      }

      const hasCache = await caches.has(cacheName);

      if (hasCache) {
        const hasDeleted = await caches.delete(cacheName);

        expect(hasDeleted).to.be.true;

        // wait for good measure for cache to be deleted
        // seems to be flaky without this
        cy.wait(300);
      }
    });
});

/**
 * Dispatch an event with an optional payload, used for
 * simulating browser events.
 */
Cypress.Commands.add(
  "triggerEvent",
  { prevSubject: "window" },
  (win, eventName, eventInit = undefined) => {
    const event = new Event(eventName, eventInit);
    win.dispatchEvent(event);
  }
);

/**
 * Waits for the default Ionic timeout, which is specified
 * from configuration
 */
Cypress.Commands.add("waitForIonicAnimations", () => {
  cy.wait(Cypress.env().ionicAnimationTimeout);
});

/**
 * Waits for initial orders to load from backend and will
 * use the Cypress pageLoadTimeout by default
 */
Cypress.Commands.add("waitForAppReadiness", () => {
  cy.findByTestId("orders-list", {
    timeout: Cypress.config().pageLoadTimeout,
  }).should("be.visible");
});
