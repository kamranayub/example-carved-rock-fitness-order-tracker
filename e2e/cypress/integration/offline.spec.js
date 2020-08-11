/**
 * Offline test suite
 *
 * These test offline and online support through native events. At the moment,
 * the app does not switch to an "offline" state if requests fail since
 * the requests are cached for offline usage. However, it does listen to
 * the `online` and `offline` events to show toast messages.
 */
describe("offline support", () => {
  before(() => {
    cy.visit("/");
  });

  it("should load orders when online", () => {
    // This also doubles as waiting for orders to load
    cy.findByTestId("orders-list").should("be.visible");
  });

  describe("when going offline", () => {
    beforeEach(() => {
      // Start a Cypress server to intercept and mock XHR requests
      cy.server();

      // Set up a 404 route for any URLs matching /orders/
      // which represents our backend requests
      cy.route({
        url: new RegExp(/\/orders/),
        status: 404,
        response: "Not Found",
      });

      // Simulate the user going offline
      cy.window().triggerEvent("offline");
    });

    it("should show toast when browser goes offline", () => {
      cy.get("ion-toast[data-presented]")
        .shadow()
        .findByText(
          "Looks like you went offline, your data may not be up-to-date."
        );

      // Wait for the toast to automatically dismiss after a few seconds
      // we increase the timeout to account for any delays
      cy.get("ion-toast[data-presented]", { timeout: 10 * 1000 }).should(
        "not.exist"
      );
    });

    it("should navigate to order details using cache", () => {
      // Click on the first order item in the list
      cy.findByText("Order #1001").click();

      // If the data is loaded, we know the data was served from the cache
      // since a network request would result in a 404
      cy.findByText("Backpacker's Guide to Colorado Hiking Trails").should(
        "be.visible"
      );
    });
  });

  describe("when coming back online", () => {
    it("should show toast", () => {
      // Simulate the user reconnecting to the network
      cy.window().triggerEvent("online");

      cy.get("ion-toast[data-presented]")
        .shadow()
        .findByText(
          "You're back online, your data is automatically being updated."
        );
    });

    it("should refetch orders", () => {
      // Start up another Cypress server (since the one in the previous describe
      // block is cleaned up)
      cy.server();

      // Spy on any /orders/ requests and set up an alias
      cy.route("**/orders/*").as("getOrder");

      // This event is listened to by the app to refetch
      // orders, so this is more about simulating coming back online
      cy.window().triggerEvent("online");

      // At least one /orders/ request should be
      // initiated after coming back online
      cy.wait("@getOrder");
    });
  });
});
