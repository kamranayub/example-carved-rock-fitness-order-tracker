describe("service workers", () => {
  beforeEach(() => {
    // Clear any session storage for the test run, such as cy_sw_bypass flags
    cy.clearSessionStorage();
  });

  it("should wait for service worker to be registered", () => {
    // Bypass service worker initially so we can check the cache properly
    cy.visit("/", { useSw: true, qs: { cy_initialize: true } });

    // Empty the orders cache
    cy.clearCacheStorage("orders");

    // Initialize the application
    cy.window().its("__CY_INITIALIZE_APP").invoke();

    // We have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should load orders without caching on initial load", () => {
    cy.reload();

    // Ensure no order cache entries exist
    cy.waitForCacheStorage("orders", {
      maximumCacheEntries: 0,
    });

    // Initialize the application
    cy.window().its("__CY_INITIALIZE_APP").invoke();

    // Orders should load from network
    cy.findByTestId("orders-list").should("be.visible");
  });

  it("should load orders immediately from cache on reload", () => {
    cy.reload();

    // Ensure order cache entries exist
    cy.waitForCacheStorage("orders", {
      minimumCacheEntries: 1,
    });

    // Initialize the application
    cy.window().its("__CY_INITIALIZE_APP").invoke();

    // Orders will load from cache
    cy.findByTestId("orders-list").should("be.visible");
  });
});
