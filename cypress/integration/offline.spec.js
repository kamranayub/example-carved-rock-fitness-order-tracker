describe("offline support", () => {
  before(() => {
    cy.visit("/");
  });

  it("should wait for service worker to be registered", () => {
    // we have a hook that adds an HTML classname when service worker is ready
    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should load orders when online", () => {
    cy.findByText("Order #1001").should("be.visible");
  });

  describe("when going offline", () => {
    beforeEach(() => {
      cy.unregisterServiceWorkers();
      cy.server({ force404: true });
      cy.offline();
    });

    it("should show toast when browser goes offline", () => {
      cy.get("ion-toast:not(.overlay-hidden)")
        .should("be.visible")
        .should((e) => {
          const [dom] = e.get();
          const message = dom.shadowRoot.querySelector(".toast-message");

          expect(message).to.have.text(
            "Looks like you went offline, your data may not be up-to-date."
          );
        });
    });

    it("should navigate to order details using cache", () => {
      cy.findByText("Order #1001").click();
      cy.findByText("Backpacker's Guide to Colorado Hiking Trails").should(
        "be.visible"
      );
    });
  });

  describe("when coming back online", () => {
    beforeEach(() => {
      cy.online();
    });

    it("should show toast", () => {
      cy.get("ion-toast:not(.overlay-hidden)")
        .should("be.visible")
        .should((e) => {
          const [dom] = e.get();
          const message = dom.shadowRoot.querySelector(".toast-message");

          expect(message).to.have.text(
            "You're back online, your data is automatically being updated."
          );
        });
    });
  });
});
