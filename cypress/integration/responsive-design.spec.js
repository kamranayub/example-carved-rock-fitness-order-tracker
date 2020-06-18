describe("responsive design", () => {
  //
  // For Ionic default breakpoints,
  // see https://ionicframework.com/docs/layout/css-utilities#ionic-breakpoints
  //

  describe("size: phones", () => {
    before(() => {
      cy.visit("/");
    });

    ["portrait", "landscape"].forEach((orientation) => {
      describe(`in ${orientation}`, () => {
        it("should display menu navigation button", () => {
          cy.viewport("iphone-6", orientation);
          cy.get("ion-menu-button").should("be.visible");
        });

        it("should open left menu using menu button navigation", () => {
          cy.viewport("iphone-6", orientation);
          cy.get("ion-menu-button").click();
          cy.get('ion-menu[role="navigation"]').should("be.visible");
          cy.get('ion-menu ion-item[href="/orders"]')
            .should("be.visible")
            .should("contain.text", "My Orders");
        });

        it("should close left menu when clicking off", () => {
          cy.viewport("iphone-6", orientation);
          cy.waitForIonicAnimations();
          cy.get('ion-menu[role="navigation"]')
            .click("topRight")
            .should("not.be.visible");
        });

        it("should not display marketing imagery", () => {
          cy.viewport("iphone-6", orientation);
          cy.get(".hero-image-col").should("not.be.visible");
        });
      });
    });
  });

  describe(
    "size: tablet / medium",
    { viewportWidth: 768, viewportHeight: 1024 },
    () => {
      before(() => {
        cy.visit("/");
      });

      it("should display left menu always", () => {
        cy.get('ion-menu[role="navigation"]').should("be.visible");
      });

      it("should not display menu navigation button", () => {
        cy.get("ion-menu-button").should("not.be.visible");
      });

      it("should display marketing imagery", () => {
        cy.get(".hero-image-col").should("be.visible");
      });
    }
  );

  describe("size: large", { viewportWidth: 1440, viewportHeight: 900 }, () => {
    before(() => {
      cy.visit("/");
    });

    it("should display marketing imagery", () => {
      cy.get(".hero-image-col").should("be.visible");
    });
  });
});
