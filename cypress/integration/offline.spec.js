describe("offline support", () => {
  before(() => {
    cy.visit("/");
  });

  it("should load orders when online", () => {
    cy.findByText("Order #1001").should("be.visible");
  });

  describe("when going offline", () => {
    beforeEach(() => {
      cy.server();

      // Return 404 for backend requests
      cy.route({
        url: new RegExp(/\/orders/),
        status: 404,
        response: "Not Found",
      });

      cy.window().triggerEvent("offline");
    });

    it("should show toast when browser goes offline", () => {
      cy.get("ion-toast[data-presented]")
        .should("exist")
        .shadow()
        .find(".toast-message")
        .should(
          "have.text",
          "Looks like you went offline, your data may not be up-to-date."
        );

      // wait for automatic dismissal
      cy.get("ion-toast[data-presented]", { timeout: 10 * 1000 }).should(
        "not.exist"
      );
    });

    it("should navigate to order details using cache", () => {
      cy.findByText("Order #1001").click();
      cy.findByText("Backpacker's Guide to Colorado Hiking Trails").should(
        "be.visible"
      );
    });
  });

  describe("when coming back online", () => {
    it("should show toast", () => {
      cy.window().triggerEvent("online");
      cy.get("ion-toast[data-presented]")
        .should("exist")
        .shadow()
        .find(".toast-message")
        .should(
          "have.text",
          "You're back online, your data is automatically being updated."
        );
    });

    it("should refetch orders", () => {
      cy.server();
      cy.route("**/orders/*").as("getOrder");

      cy.window().triggerEvent("online");

      cy.wait("@getOrder");
    });
  });
});
