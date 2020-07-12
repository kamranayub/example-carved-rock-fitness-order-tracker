describe("responsive design", () => {
  describe("on phones", () => {
    before(() => {
      cy.visit("/");
    });

    ["portrait", "landscape"].forEach((orientation) => {
      describe(`in ${orientation}`, () => {
        it("should display menu navigation button", () => {});

        it("should open left menu using menu button navigation", () => {});

        it("should close left menu when clicking off", () => {});

        it("should not display marketing imagery", () => {});
      });
    });
  });

  describe("on tablet-sized screens", () => {
    before(() => {
      cy.visit("/");
    });

    it("should not display left menu", () => {});

    it("should be the first size to show marketing imagery", () => {});

    it("should display left menu in landscape", () => {});
  });

  describe("on larger screens", () => {
    before(() => {
      cy.visit("/");
    });

    it("should continue displaying marketing imagery", () => {});
  });
});
