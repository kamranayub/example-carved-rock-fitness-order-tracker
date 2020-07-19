describe("service workers", () => {
  beforeEach(() => {
    // Clear any session storage for the test run, such as cy_sw_bypass flags
    cy.clearSessionStorage();
  });

  it("should wait for service worker to be registered", () => {
    // Bypass service worker initially so we can check the cache properly
    cy.visit("/", { useSw: true });
    // We have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should clear the service worker cache", () => {
    // Empty the orders cache
    cy.clearCacheStorage("orders");
  });

  it("should load orders without caching on initial load", () => {
    cy.visit("/", { useSw: true, qs: { cy_initialize: true } });

    // Ensure no order cache entries exist
    cy.waitForCacheStorage("orders", {
      maximumCacheEntries: 0,
    });

    // Initialize the application
    cy.window().invoke("__CY_INITIALIZE_APP");

    // Orders should load from network
    cy.findByTestId("orders-list").should("be.visible");
  });

  it("should load orders immediately from cache on reload", () => {
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
