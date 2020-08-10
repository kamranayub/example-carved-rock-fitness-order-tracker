/**
 * Notifications tests
 *
 * These tests cover showing "local" (i.e. not push) notifications and how to simulate
 * permission API requests using Cypress stubbing.
 *
 * This does not test Web Push Notifications using the Service Worker but in a later edition
 * of the course, I may add that. It would look very similar, except mocking different APIs
 * or using `cy.task` to tell the backend to send a push notification and then having the app
 * call a window.__CY_* callback when the notification is received.
 */
import { isPermissionAllowed } from "cypress-browser-permissions";

describe("notifications", () => {
  it("will prompt user for permission to enable notifications when permission has not been set", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        // Tell the Permissions API to return the "prompt" state
        // when asked for notifications permissions
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "prompt" });

        win.navigator.permissions.query.callThrough();

        // We effectively just want to spy on this method
        cy.stub(win.Notification, "requestPermission");
      },
    });

    // This will grab the toggle, which uses aria-label
    cy.findByLabelText("Toggle Push Notifications").click();

    // We just need to verify permission was requested
    cy.window().its("Notification.requestPermission").should("be.called");
  });

  it("will not prompt user for permission to enable notifications when permission has been granted", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        // Tell the Permissions API to return the "prompt" state
        // when asked for notifications permissions
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();

        // We effectively just want to spy on this method
        cy.stub(win.Notification, "requestPermission");
      },
    });

    // This will grab the toggle, which uses aria-label
    cy.findByLabelText("Toggle Push Notifications").click();

    // We just need to verify permission was NOT requested
    cy.window().its("Notification.requestPermission").should("not.be.called");
  });

  it("will warn user when permissions have been denied for notifications when trying to enable", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        // Tell the Permissions API to return the "denied" state
        // when asked for notifications permissions
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "denied" });

        win.navigator.permissions.query.callThrough();

        // We don't need to spy on window.Notification because
        // it should not be called
      },
    });

    // This will grab the toggle, which uses aria-label
    cy.findByLabelText("Toggle Push Notifications").click();

    cy.get("ion-toast[data-presented]")
      .shadow()
      .findByText(
        "We'll need permission before we can send you order updates. To enable, check your browser settings for this site."
      );
  });

  it("will show message confirming the user has enabled tracking", () => {
    cy.visit("/orders/1001", {
      onBeforeLoad(win) {
        // Tell the Permissions API to return the "granted" state
        // when asked for notifications permissions
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();
      },
    });

    // This will grab the toggle, which uses aria-label
    cy.findByLabelText("Toggle Push Notifications").click();

    cy.get("ion-toast[data-presented]")
      .shadow()
      .findByText("We will notify you of any updates to this order");
  });

  // This test will fail when running in a Headless browser
  // so just in case, we skip it if that's the case.
  Cypress.browser.isHeaded &&
    it("will show desktop notification when permissions are allowed", () => {
      // Assert that permissions have been set to allow using the plugin
      expect(
        isPermissionAllowed("notifications"),
        'Please set env.browserPermissions.notifications to "allow" to enable notifications'
      ).to.be.true;

      cy.visit("/orders/1001", {
        onBeforeLoad(win) {
          // This sets up a stub on the window object that the app
          // will invoke when a notification is shown using the "show" event
          win.__CY_NOTIFICATION_PUSHED = cy.stub();
        },
      });

      // This will grab the toggle, which uses aria-label
      cy.findByLabelText("Toggle Push Notifications").click();

      // If testing Web Push notifications, this is where you'd need to inform
      // the backend to send a test notification to the browser instance. You could
      // use cy.task() for this or some other mechanism within the app (i.e. detect
      // Cypress is running and send off a message).

      // Wait for the notification to be shown, which is hard-coded to be 5 seconds during
      // the test run, but realistically if using Web Push notifications could take longer
      cy.window()
        .its("__CY_NOTIFICATION_PUSHED", { timeout: 30000 })
        .should(
          "be.calledWithMatch",
          'Your order with 2 items is now "shipped"'
        );
    });
});
