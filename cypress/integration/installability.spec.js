describe("installability", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearSessionStorage();
    cy.visit("/");
    cy.waitForAppReadiness();
  });

  it("should show toast when browser prompts for install", () => {
    cy.window().triggerEvent("beforeinstallprompt");
    cy.get("ion-toast[data-presented]")
      .shadow()
      .findByText("Install this app for faster access next time");
  });

  it("should be able to dismiss toast", () => {
    cy.window().triggerEvent("beforeinstallprompt");
    cy.get("ion-toast[data-presented]")
      .as("installToast")
      .shadow()
      .findByText("Maybe Later")
      .click();

    cy.get("@installToast").should("not.exist");
  });

  it("should not prompt again once dismissed", () => {
    cy.window().triggerEvent("beforeinstallprompt");

    cy.get("ion-toast[data-presented]")
      .as("installToast")
      .shadow()
      .findByText("Maybe Later")
      .click();

    cy.get("@installToast").should("not.exist");
    cy.window().triggerEvent("beforeinstallprompt");
    cy.get("@installToast").should("not.exist");
  });

  it("should not prompt when app is installed while launched", () => {
    cy.window().triggerEvent("appinstalled").wait(100);
    cy.window().triggerEvent("beforeinstallprompt");
    cy.get("ion-toast").wait(100).should("not.have.attr", "data-presented");
  });

  describe("when launched from a home screen", () => {
    beforeEach(() => {
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
    });

    it("should not prompt", () => {
      cy.window().triggerEvent("beforeinstallprompt");
      cy.get("ion-toast").wait(100).should("not.have.attr", "data-presented");
    });
  });
});
