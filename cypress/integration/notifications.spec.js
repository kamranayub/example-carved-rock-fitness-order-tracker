function getChromePrefValue(pref) {
  return Cypress.env(`chromePreferences__${pref.replace(/\./gi, "__")}`);
}

function isChromePermissionAllowed(api) {
  return (
    getChromePrefValue("profile.managed_default_content_settings." + api) === 1
  );
}

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
    cy.get("ion-toast[data-presented]")
      .should("exist")
      .shadow()
      .find(".toast-message")
      .should(
        "contain.text",
        "We'll need permission before we can send you order updates. To enable, check your browser settings for this site."
      );
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
    cy.get("ion-toast[data-presented]")
      .should("exist")
      .shadow()
      .find(".toast-message")
      .should(
        "contain.text",
        "We will notify you of any updates to this order"
      );
  });

  Cypress.env().CI &&
    it("will simulate sending desktop notification", () => {
      cy.visit("/orders/1001", {
        onBeforeLoad(win) {
          cy.stub(win.navigator.permissions, "query")
            .withArgs({ name: "notifications" })
            .resolves({ state: "granted" });

          win.navigator.permissions.query.callThrough();
          cy.spy(win, "Notification");
        },
      });
      cy.findByLabelText("Toggle Push Notifications").click();
      cy.get("ion-toast[data-presented]")
        .should("exist")
        .shadow()
        .find(".toast-message")
        .should(
          "contain.text",
          "We will notify you of any updates to this order"
        );

      cy.window()
        .its("Notification", { timeout: 30000 })
        .should("be.calledWithMatch", `Order #1001 Status`, {
          body: 'Your order with 2 items is now "shipped"',
        });
    });

  Cypress.browser.isHeaded &&
    isChromePermissionAllowed("notifications") &&
    it("will show desktop notification when permissions are allowed", () => {
      cy.visit("/orders/1001", {
        onBeforeLoad(win) {
          win.__CY_NOTIFICATION_PUSHED = cy.stub();
        },
      });
      cy.findByLabelText("Toggle Push Notifications").click();

      cy.get("ion-toast[data-presented]")
        .should("exist")
        .shadow()
        .find(".toast-message")
        .should(
          "contain.text",
          "We will notify you of any updates to this order"
        );

      cy.window()
        .its("__CY_NOTIFICATION_PUSHED", { timeout: 30000 })
        .should(
          "be.calledWithMatch",
          'Your order with 2 items is now "shipped"'
        );
    });
});
