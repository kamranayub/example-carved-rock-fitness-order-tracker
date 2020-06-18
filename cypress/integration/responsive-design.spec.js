describe("responsive design", () => {
  describe("size: xs", () => {
    beforeAll(() => {
      cy.visit("/");
      cy.viewport(480, 768);
    });
  });
});
