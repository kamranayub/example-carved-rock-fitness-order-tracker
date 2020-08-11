/**
 * Service Worker Caching test suite
 *
 * These tests cover ensuring the cache mechanics of the SW work as expected.
 *
 * Remember: When testing service workers, you have to wait for the new service worker
 * to activate before you're actually testing the latest code. On fresh test runs, like
 * in CI, you won't have issues but locally, double check the service worker activation
 * in the browser if you're seeing old code.
 *
 */
describe("service workers", () => {
  beforeEach(() => {
    // Clear any session storage for the test run, such as cy_sw_bypass flags
    cy.clearSessionStorage();
  });

  it("should wait for service worker to be registered", () => {
    // The useSw flag is a custom option, see commands.js
    cy.visit("/", { useSw: true });

    // We have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should load orders without caching on initial load", () => {
    // Control when we initialize the app
    // otherwise there is a race condition where the
    // app initializes and prefetches data which warms the cache
    // before we're able to assert on it
    cy.visit("/", { useSw: true, qs: { cy_initialize: true } });

    // Empty the orders cache
    cy.clearCacheStorage("orders");

    // Ensure no order cache entries exist
    //
    // This can still be flaky in edge cases, I've noticed
    // on CI. I think what can happen is XHR requests finish
    // from a previous page load and aren't canceled or are
    // canceled slightly too late and cause the cache to be
    // populated before this line gets hit.
    cy.waitForCacheStorage("orders", {
      maximumCacheEntries: 0,
    });

    // Initialize the application
    cy.window().invoke("__CY_INITIALIZE_APP");

    // Orders should load from network
    cy.findByTestId("orders-list").should("be.visible");
  });

  it("should load orders immediately from cache on reload", () => {
    // Control when we initialize the app
    cy.visit("/", { useSw: true, qs: { cy_initialize: true } });

    // Ensure order cache entries exist
    cy.waitForCacheStorage("orders", {
      minimumCacheEntries: 1,
    });

    // Initialize the application
    cy.window().invoke("__CY_INITIALIZE_APP");

    // Orders will load from cache
    cy.findByTestId("orders-list").should("be.visible");
  });
});
