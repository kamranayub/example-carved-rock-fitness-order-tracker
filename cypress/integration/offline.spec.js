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
      // We cannot stub or intercept Service Worker fetch requests
      // because they exist in a separate context and Cypress does
      // not yet support stubbing them.
      //
      // To emulate "going offline" which would result in 404s or
      // other network errors, we remove the SW and force all requests
      // to abort.
      cy.unregisterServiceWorkers();
      cy.server({ force404: true });
      cy.offline();
    });

    it("should show toast when browser goes offline", () => {
      cy.get("ion-toast[data-presented]")
        .as("offlineToast")
        .should("exist")
        .should((e) => {
          const [el] = e.get();
          const message = el.shadowRoot.querySelector(".toast-message");
          expect(message).to.have.text(
            "Looks like you went offline, your data may not be up-to-date."
          );
        });

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
    beforeEach(() => {
      cy.online();
    });

    it("should show toast", () => {
      cy.get("ion-toast[data-presented]")
        .should("exist")
        .should((e) => {
          const [el] = e.get();
          const message = el.shadowRoot.querySelector(".toast-message");
          expect(message).to.have.text(
            "You're back online, your data is automatically being updated."
          );
        });
    });

    it("should refetch orders", () => {
      cy.server();
      cy.route("**/orders/*").as("getOrder");

      cy.online();

      cy.wait("@getOrder");
    });
  });
});
