describe("installability", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();
    cy.visit("/");
    cy.waitForAppReadiness();
  });

  it("should show toast when browser prompts for install", () => {
    cy.triggerBeforeInstallEvent();
    cy.get("ion-toast[data-presented]")
      .should("exist")
      .shadow()
      .find(".toast-message")
      .should("have.text", "Install this app for faster access next time");
  });

  it("should be able to dismiss toast", () => {
    cy.triggerBeforeInstallEvent();
    cy.get("ion-toast[data-presented]")
      .as("installToast")
      .should("exist")
      .shadow()
      .find("button.toast-button-cancel")
      .click();

    cy.get("@installToast").should("not.be.visible");
  });

  it("should not prompt again once dismissed", () => {
    cy.triggerBeforeInstallEvent();

    cy.get("ion-toast[data-presented]")
      .as("installToast")
      .should("exist")
      .shadow()
      .find("button.toast-button-cancel")
      .click();

    cy.get("@installToast").should("not.exist");

    cy.triggerBeforeInstallEvent();

    cy.wait(500);
    cy.get("@installToast").should("not.exist");
  });

  describe("when launched from a home screen", () => {
    beforeEach(() => {
      cy.visit("/", {
        onBeforeLoad(window) {
          console.log("executed cy.visit onBeforeLoad");
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
    });

    it("should not prompt", () => {
      cy.triggerBeforeInstallEvent();
      cy.wait(500);
      cy.get("ion-toast[data-presented]").should("not.exist");
    });
  });

  it("should not prompt when app is installed while launched", () => {
    cy.window().then((window) => {
      const appInstalledEvent = new Event("appinstalled");
      window.dispatchEvent(appInstalledEvent);
    });
    cy.triggerBeforeInstallEvent();
    cy.wait(500);
    cy.get("ion-toast[data-presented]").should("not.exist");
  });
});
