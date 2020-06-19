describe("installability", () => {
  before(() => {
    cy.visit("/");
  });

  it("should show toast when browser prompts for install", () => {
    cy.window().trigger("beforeinstallprompt");
    cy.get("ion-toast ion-toast-message")
      .should("be.visible")
      .should("contain.text", "Install this app for faster access next time");
  });

  it("should be able to dismiss toast", () => {
    cy.get('ion-toast ion-button[role="cancel"]').click();
    cy.get("ion-toast").should("not.be.visible");
  });

  it("should not prompt again once dismissed", () => {
    cy.reload();
    cy.window().trigger("beforeinstallprompt");
    cy.get("ion-toast").should("not.be.visible");
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
