import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`);

const navigationRoute = new NavigationRoute(handler, {
  denylist: [new RegExp("^/_"), new RegExp("/[^/?]+\\.[^/]+$")],
});

registerRoute(navigationRoute);

const bool = (v: string | undefined | null) => v === "true" || false;
//
// Attempt to retrieve latest orders, otherwise fallback to cached
// responses.
//
registerRoute(
  ({ url }) => {
    const shouldFetchValue =
      window.sessionStorage.getItem("SW_SHOULD_FETCH") || true;
    const shouldFetch =
      typeof shouldFetchValue === "string"
        ? bool(shouldFetchValue)
        : shouldFetchValue;

    console.log("Matching SW backend route, shouldFetch:", shouldFetch, url);

    return (
      shouldFetch &&
      url.origin === "https://carved-rock-fitness-backend.azurewebsites.net"
    );
  },
  new NetworkFirst({
    networkTimeoutSeconds: 5,
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
    console.log("Handled SW message event", event.data);

    switch (event.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      case "SET_SHOULD_FETCH":
        window.sessionStorage.setItem(
          "SW_SHOULD_FETCH",
          String(event.data.value)
        );
        break;
    }
  }
});
