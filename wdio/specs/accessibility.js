describe("webdriver.io page", () => {
  it("should have the right title", async () => {
    await browser.url("/");
    await expect(browser).toHaveTitle("Carved Rock Fitness Order Tracker");
  });
});
