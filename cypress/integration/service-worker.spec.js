describe("service workers", () => {
  it("should wait for service worker to be registered", () => {
    // purposefully enable service worker
    cy.visit("/", { useSw: true });

    // we have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  // Prevent this test from running if we already ran it once
  // since SW will cache and serve the app data
  !Cypress.env("SW_ALREADY_RAN") &&
    it("should load orders once without caching", () => {
      cy.findByTestId("orders-list").should("not.have.attr", "data-from-cache");
      cy.findByText("Order #1001").should("be.visible");
      Cypress.env("SW_ALREADY_RAN", true);
    });

  it("should load orders immediately from cache on reload", () => {
    cy.reload();
    cy.findByTestId("orders-list").should("have.attr", "data-from-cache");
    cy.findByText("Order #1001").should("be.visible");
  });
});
