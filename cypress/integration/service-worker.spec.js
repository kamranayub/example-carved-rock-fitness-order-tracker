describe("service worker readiness", () => {
  it("should wait for service worker to be registered", () => {
    cy.visit("/");
    // we have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });
});
