describe("service workers", () => {
  it("should wait for service worker to be registered", () => {
    // purposefully enable service worker
    cy.visit("/", { useSw: true });

    // we have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  // Prevent this test from running locally since Cypress
  // does not clear the service worker on each test run
  Cypress.env().CI &&
    it("should load orders once without caching", () => {
      cy.findByText("Order #1001").should("be.visible");
      cy.findByTestId("orders-list").should("not.have.class", "sw-cached");
    });

  it("should load orders immediately from cache on reload", () => {
    cy.reload();
    cy.findByText("Order #1001").should("be.visible");
    cy.findByTestId("orders-list").should("have.class", "sw-cached");
  });
});
