/**
 * Customized install prompt tests
 *
 * These tests cover customizing the install prompt experience in supported browsers,
 * like Chrome and Edge. It also covers NOT displaying a prompt after the user installs
 * the PWA _or_ when launching from the home screen. Coverage of iOS home-screen launching
 * is done using WebdriverIO and BrowserStack, as a separate example of testing on real
 * devices.
 */

describe("installability", () => {
  beforeEach(() => {
    // Clear before each test because the app stores whether a user dismissed
    // the prompt in session storage, which can lead to session storage influencing
    // tests
    cy.clearSessionStorage();

    cy.visit("/");
    cy.waitForAppReadiness();
  });

  it("should show toast when browser prompts for install", () => {
    // Trigger the prompt manually since the browser will not
    // do it automatically due to security restrictions
    cy.window().triggerEvent("beforeinstallprompt");

    cy.get("ion-toast[data-presented]")
      .shadow()
      .findByText("Install this app for faster access next time");
  });

  it("should be able to dismiss toast", () => {
    // Trigger the prompt manually since the browser will not
    // do it automatically due to security restrictions
    cy.window().triggerEvent("beforeinstallprompt");

    cy.get("ion-toast[data-presented]")
      .as("installToast")
      .shadow()
      .findByText("Maybe Later")
      .click();

    cy.get("@installToast").should("not.exist");
  });

  it("should not prompt again once dismissed", () => {
    // Trigger the prompt manually since the browser will not
    // do it automatically due to security restrictions
    cy.window().triggerEvent("beforeinstallprompt");

    cy.get("ion-toast[data-presented]")
      .as("installToast")
      .shadow()
      .findByText("Maybe Later")
      .click();

    // Wait for the DOM element to be removed
    cy.get("@installToast").should("not.exist");

    // Originally, this was cy.reload() but it would cause issues
    // in Firefox, so I've switched it to the visit command
    cy.visit("/");

    // Attempt to trigger the install prompt again, as if the user
    // has begun a new session. The dismissal should be stored in session
    // storage and the prompt should NOT be shown.
    cy.window().triggerEvent("beforeinstallprompt");
    cy.get("@installToast").should("not.exist");
  });

  it("should not prompt when app is installed while launched", () => {
    // Trigger the appinstalled event and since the event handling is asynchronous
    // we need to add an extra pause, otherwise triggering the events too close
    // together will cause a flaky test
    cy.window().triggerEvent("appinstalled").wait(100);
    // The browser would not normally trigger this event after installing,
    // but since the app listens to this to perform the customized install prompt
    // logic, we can use it to ensure the prompt isn't shown
    cy.window().triggerEvent("beforeinstallprompt");

    // There is no DOM element to wait on for non-existence so instead we pause
    // and wait to ensure that no active toasts are being displayed
    cy.get("ion-toast").wait(100).should("not.have.attr", "data-presented");
  });

  describe("when launched from a home screen", () => {
    beforeEach(() => {
      cy.visit("/", {
        onBeforeLoad(window) {
          // Intercept (stub) window.matchMedia before the page loads
          // We can leave add/remove event listener alone since it
          // doesn't matter for this test.
          cy.stub(window, "matchMedia")
            .withArgs("(display-mode: standalone)")
            .callsFake(() => ({
              matches: true,
              addListener: () => false,
              removeListener: () => false,
            }));

          // If the media query doesn't match,
          // call through to the original window.matchMedia
          // so we don't break other aspects of the page
          window.matchMedia.callThrough();
        },
      });
    });

    it("should not prompt", () => {
      // Trigger the prompt manually since the browser will not
      // do it automatically due to security restrictions
      cy.window().triggerEvent("beforeinstallprompt");

      // There is no DOM element to wait on for non-existence so instead we pause
      // and wait to ensure that no active toasts are being displayed
      cy.get("ion-toast").wait(100).should("not.have.attr", "data-presented");
    });
  });
});
