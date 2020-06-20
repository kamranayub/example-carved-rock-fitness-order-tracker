describe("installability", () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();
    cy.visit("/");
  });

  it("should show toast when browser prompts for install", () => {
    cy.triggerBeforeInstallEvent();
    cy.get("ion-toast:not(.overlay-hidden)")
      .should("be.visible")
      .should((e) => {
        const [dom] = e.get();
        const message = dom.shadowRoot.querySelector(".toast-message");

        expect(message).to.have.text(
          "Install this app for faster access next time"
        );
      });
  });

  it("should be able to dismiss toast", () => {
    cy.get("ion-toast:not(.overlay-hidden)")
      .as("installToast")
      .then((toast) => {
        const [dom] = toast.get();
        const cancelButton = dom.shadowRoot.querySelector('button.toast-button-cancel');

        cancelButton.dispatchEvent(new Event('click'));
      });
    cy.get("@installToast").should("not.be.visible");
  });

  it("should not prompt again once dismissed", () => {
    cy.reload();
    cy.triggerBeforeInstallEvent();

    // toasts are invisible by default, so wait until it might pop up before
    // asserting
    cy.wait(500);
    cy.get("ion-toast:not(.overlay-hidden)").should("not.be.visible");
  });

  it("should prompt again on a new session", () => {
    cy.clearSessionStorage();
    cy.reload();
    cy.window().trigger("beforeinstallprompt");
    cy.get("ion-toast").should("be.visible");
  });

  it("should not prompt when launched from a home screen", () => {
    cy.mockMatchMedia();
    cy.window().trigger("beforeinstallprompt");
    cy.get("ion-toast").should("not.be.visible");
  });
});
