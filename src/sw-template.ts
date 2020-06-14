import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", function (event: ExtendableMessageEvent) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`);

const navigationRoute = new NavigationRoute(handler, {
  denylist: [new RegExp("^/_"), new RegExp("/[^/?]+\\.[^/]+$")],
});

registerRoute(navigationRoute);

//
// Attempt to retrieve latest orders, otherwise fallback to cached
// responses.
//
registerRoute(
  ({ url }) =>
    url.origin === "https://carved-rock-fitness-backend.azurewebsites.net",
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
