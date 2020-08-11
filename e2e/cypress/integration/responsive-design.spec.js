/**
 * Responsive design test suite
 *
 * These cover viewport tests and resize the browser to specific breakpoints
 * that change how the app gets displayed.
 *
 * I've chosen Cypress viewport presets that align with the Ionic breakpoints.
 *
 * To reference Ionic default breakpoints, see:
 * https://ionicframework.com/docs/layout/css-utilities#ionic-breakpoints
 *
 * To reference Cypress presets, see:
 * https://docs.cypress.io/api/commands/viewport.html#Arguments
 *
 */
describe("responsive design", () => {
  describe("on phones", () => {
    before(() => {
      cy.visit("/");
      cy.waitForAppReadiness();
    });

    // Execute this set of tests in both portrait/landscape
    // orientation since they fall within one breakpoint
    ["portrait", "landscape"].forEach((orientation) => {
      describe(`in ${orientation}`, () => {
        // The iPhone 6 preset falls under the small breakpoint
        beforeEach(() => cy.viewport("iphone-6", orientation));

        it("should display menu navigation button", () => {
          // There should only be one ion-menu-button on the page
          // which is the hamburger menu
          cy.get("ion-menu-button").should("be.visible");
        });

        it("should show and hide menu", () => {
          // Open the hamburger menu which slides out from the left
          cy.get("ion-menu-button").click();

          // Find the navigation menu, then find the menu item
          // that contains the text "My Orders" which is a link
          cy.findByRole("navigation")
            .findByText("My Orders")
            .should("be.visible");

          // We have to wait for the Ionic menu to slide out
          // because Cypress doesn't automatically wait for it
          // before executing the next command which can make
          // this test flaky.
          cy.waitForIonicAnimations();

          // Click in the top right corner of the element,
          // which is the "dismiss" zone which should close the menu
          cy.findByRole("navigation")
            .click("topRight")
            .should("not.be.visible");
        });

        it("should not display marketing imagery", () => {
          // This is the classname I've assigned the hero imagery
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
      // Use the iPad 2 preset which is the medium breakpoint
      cy.viewport("ipad-2");

      // There should be no left menu displayed in portrait orientation
      cy.findByRole("navigation").should("not.be.visible");

      // Instead there should still be a hamburger menu
      cy.get("ion-menu-button").should("be.visible");
    });

    it("should display left menu in landscape", () => {
      // Flip the orientation to landscape
      cy.viewport("ipad-2", "landscape");

      // Now, the left nav should be fixed to the left side
      cy.findByRole("navigation").should("be.visible");

      // And there should no longer be a hamburger menu icon
      cy.get("ion-menu-button").should("not.be.visible");
    });

    it("should be the first size to show marketing imagery", () => {
      // Go back to portrait mode
      cy.viewport("ipad-2");

      // Unlike phone sizes, the hero imagery should be visible
      // on this breakpoint
      cy.get(".hero-image-col").should("be.visible");
    });
  });

  describe("on larger screens", () => {
    before(() => {
      cy.visit("/");
    });

    it("should continue displaying marketing imagery", () => {
      // The Macbook is one of the larger presets
      cy.viewport("macbook-15");

      // We ensure the marketing imagery continues to be shown
      // however we could also try and test whether the scale
      // changes, since I apply a custom style to scale up the
      // logo on the highest breakpoint
      cy.get(".hero-image-col").should("be.visible");
    });
  });
});
