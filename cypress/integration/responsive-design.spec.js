describe("responsive design", () => {
  //
  // To reference Ionic default breakpoints, see:
  // https://ionicframework.com/docs/layout/css-utilities#ionic-breakpoints
  //
  // To reference Cypress presets, see:
  // https://docs.cypress.io/api/commands/viewport.html#Arguments
  //

  describe("on phones", () => {
    before(() => {
      cy.visit("/");
      cy.waitForAppReadiness();
    });

    ["portrait", "landscape"].forEach((orientation) => {
      describe(`in ${orientation}`, () => {
        beforeEach(() => cy.viewport("iphone-6", orientation));

        it("should display menu navigation button", () => {
          cy.get("ion-menu-button").should("be.visible");
        });

        it("should show and hide menu", () => {
          cy.get("ion-menu-button").click();
          cy.get("ion-list").findByText("My Orders").should("be.visible");
          cy.waitForIonicAnimations();
          cy.get('ion-menu[role="navigation"]')
            .click("topRight")
            .should("not.be.visible");
        });

        it("should not display marketing imagery", () => {
          cy.get(".hero-image-col").should("not.be.visible");
        });
      });
    });
  });

  describe("on tablet-sized screens", () => {
    before(() => {
      cy.visit("/");
    });

    it("should not display left menu", () => {
      cy.viewport("ipad-2");
      cy.get('ion-menu[role="navigation"]').should("not.be.visible");
      cy.get("ion-menu-button").should("be.visible");
    });

    it("should be the first size to show marketing imagery", () => {
      cy.viewport("ipad-2");
      cy.get(".hero-image-col").should("be.visible");
    });

    it("should display left menu in landscape", () => {
      cy.viewport("ipad-2", "landscape");
      cy.get('ion-menu[role="navigation"]').should("be.visible");
      cy.get("ion-menu-button").should("not.be.visible");
    });
  });

  describe("on larger screens", () => {
    before(() => {
      cy.visit("/");
    });

    it("should continue displaying marketing imagery", () => {});
  });
});
