describe("orders", () => {
  before(() => {
    cy.visit("/");
  });

  it("should show orders list", () => {
    cy.findByText("Order #1001").should("not.be.visible");
  });
});
