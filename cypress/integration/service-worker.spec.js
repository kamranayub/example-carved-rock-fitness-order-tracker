describe("service workers", () => {
  it("should wait for service worker to be registered", () => {
    // purposefully enable service worker
    cy.visit("/", {});

    // we have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should clear service worker cache", () => {
    // cy.waitForCacheStorage("orders", {
    //   minimumCacheEntries: 1,
    // });
    cy.clearCacheStorage("orders");
  });

  it("should load orders without caching on initial load", () => {
    cy.visit("/", { useSw: true });
    cy.findByTestId("orders-list").should("be.visible");
    cy.get("html").should("not.have.class", "sw-orders-cache-exists");
    cy.waitForCacheStorage("orders", {
      minimumCacheEntries: 1,
    });
  });

  it("should load orders immediately from cache on reload", () => {
    cy.visit("/", { useSw: true });
    cy.findByTestId("orders-list").should("be.visible");
    cy.get("html").should("have.class", "sw-orders-cache-exists");
  });
});
