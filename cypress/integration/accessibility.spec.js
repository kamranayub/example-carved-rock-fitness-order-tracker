describe("accessibility", () => {
  before(() => {
    cy.visit("/");
    cy.findByText("Order #1001").should("be.visible");
  });

  it("should set My Orders nav element as first focused element", () => {
    cy.get("body").tab().debug();
    cy.pause();
    cy.get(".ion-focused").should("have.text", "My Orders");
  });

  it("should be able to select an order using the keyboard", () => {
    cy.focused().tab();
    cy.get(".ion-focused").should("have.text", "Orders #1001");
  });
});
