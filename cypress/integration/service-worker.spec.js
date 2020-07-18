describe("service workers", () => {
  it("should wait for service worker to be registered", () => {
    // purposefully enable service worker
    cy.visit("/", { useSw: true });

    // we have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should clear service worker cache", () => {
    cy.clearCacheStorage();
  });

  it("should load orders without caching on initial load", () => {
    cy.reload();
    cy.findByText("Order #1001").should("be.visible");
    cy.findByTestId("orders-list").should("not.have.class", "sw-cached");
  });

  it("should load orders immediately from cache on reload", () => {
    cy.reload();
    cy.findByText("Order #1001").should("be.visible");
    cy.findByTestId("orders-list").should("have.class", "sw-cached");
  });
});
