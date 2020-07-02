describe("notifications", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("will prompt user for permission to enable notifications when permission has not been set", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "prompt" });

        win.navigator.permissions.query.callThrough();

        cy.stub(win.Notification, "requestPermission").resolves("granted");
      },
    });
    cy.findByLabelText("Toggle Push Notifications").click();
    cy.window().its("Notification.requestPermission").should("be.called");
  });

  it("will not prompt user for permission to enable notifications when permission has been granted", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();

        cy.stub(win.Notification, "requestPermission");
      },
    });
    cy.findByLabelText("Toggle Push Notifications").click();
    cy.window().its("Notification.requestPermission").should("not.be.called");
  });

  it("will warn user when permissions have been denied for notifications when trying to enable", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "denied" });

        win.navigator.permissions.query.callThrough();
      },
    });
    cy.findByLabelText("Toggle Push Notifications").click();
    cy.get("ion-toast:not(.overlay-hidden)")
      .should("exist")
      .should((e) => {
        const [dom] = e.get();
        expect(dom.shadowRoot.querySelector(".toast-message")).to.contain.text(
          "We'll need permission before we can send you order updates. To enable, check your browser settings for this site."
        );
      });
  });

  it("will show message confirming the user has enabled tracking", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();
      },
    });
    cy.findByLabelText("Toggle Push Notifications").click();
    cy.get("ion-toast:not(.overlay-hidden)")
      .should("exist")
      .should((e) => {
        const [dom] = e.get();
        expect(dom.shadowRoot.querySelector(".toast-message")).to.contain.text(
          "We will notify you of any updates to this order"
        );
      });
  });

  it("will send desktop notification during test run after 6 seconds", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();
        win.__CY_NOTIFICATION_PUSHED = cy.stub();
      },
    });
    cy.findByLabelText("Toggle Push Notifications").click();
    cy.get("ion-toast:not(.overlay-hidden)")
      .should("exist")
      .should((e) => {
        const [dom] = e.get();
        expect(dom.shadowRoot.querySelector(".toast-message")).to.contain.text(
          "We will notify you of any updates to this order"
        );
      });
    cy.window()
      .its("__CY_NOTIFICATION_PUSHED", { timeout: 30000 })
      .should("be.calledWithMatch", {
        body: 'Your order with 2 items is now "Shipped"',
      });
  });
});
