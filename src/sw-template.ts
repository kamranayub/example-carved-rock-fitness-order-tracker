import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`);

const navigationRoute = new NavigationRoute(handler, {
  denylist: [
    // URLs starting with /_ such as Cypress/Gatsby URLs
    new RegExp("^/_"),
    // Bypassing for Cypress tests for page AND API requests
    new RegExp("cy_sw_bypass"),
    // Bypassing for Cypress tests for ONLY page requests
    new RegExp("cy_sw_page_only_bypass"),
    new RegExp("/[^/?]+\\.[^/]+$"),
  ],
});

registerRoute(navigationRoute);

//
// Attempt to retrieve latest orders, otherwise fallback to cached
// responses.
//
registerRoute(
  ({ url }) => {
    const shouldFetch = !url.searchParams.has("cy_sw_bypass");

    if (!shouldFetch) {
      console.log("Bypassing SW handling of URL", url.toString());
    }

    return shouldFetch && url.pathname.includes("/api/orders/");
  },
  new StaleWhileRevalidate({
    cacheName: "orders",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

//
// Cache image requests
//
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

self.addEventListener("message", function (event: ExtendableMessageEvent) {
  if (event.data) {
    switch (event.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
    }
  }
});
