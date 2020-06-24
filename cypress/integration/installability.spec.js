describe("installability", () => {
  beforeEach(() => {
    // Clear all browser state we may be using
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();

    // Reload the page
    cy.visit("/");

    // Wait for orders to load
    cy.findByText("Order #1001").should("be.visible");
  });

  it("should show toast when browser prompts for install", () => {
    cy.triggerBeforeInstallEvent();
    cy.get("ion-toast:not(.overlay-hidden)")
      .shadow()
      .find(".toast-container")
      .should("be.visible")
      .find(".toast-message")
      .should("have.text", "Install this app for faster access next time");
  });

  it("should be able to dismiss toast", () => {
    cy.triggerBeforeInstallEvent();
    cy.get("ion-toast:not(.overlay-hidden)")
      .as("installToast")
      .shadow()
      .find(".toast-container")
      .should("be.visible")
      .find("button.toast-button-cancel")
      .click();
    cy.get("@installToast").should("not.be.visible");
  });

  it("should not prompt again once dismissed", () => {
    cy.triggerBeforeInstallEvent();

    cy.get("ion-toast:not(.overlay-hidden)")
      .as("installToast")
      .shadow()
      .find(".toast-container")
      .should("be.visible")
      .find("button.toast-button-cancel")
      .click();

    cy.get("@installToast").should("not.be.visible");

    cy.triggerBeforeInstallEvent();

    cy.wait(500);
    cy.get("@installToast").should("not.be.visible");
  });

  it("should not prompt when launched from a home screen", () => {
    cy.visit("/", {
      onBeforeLoad(window) {
        // Intercept (stub) window.matchMedia before the page loads
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
    cy.triggerBeforeInstallEvent();
    cy.wait(500);
    cy.get("ion-toast:not(.overlay-hidden)").should("not.be.visible");
  });

  it("should not prompt when app is installed while launched", () => {
    cy.window().then((window) => {
      const appInstalledEvent = new Event("appinstalled");
      window.dispatchEvent(appInstalledEvent);
    });
    cy.triggerBeforeInstallEvent();
    cy.wait(500);
    cy.get("ion-toast:not(.overlay-hidden)").should("not.be.visible");
  });
});
