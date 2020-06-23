import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;
let useXhr = false;

self.addEventListener("message", function (event: ExtendableMessageEvent) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "USE_XHR") {
    useXhr = event.data.value;
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

const apiNetworkFirst = new NetworkFirst({
  networkTimeoutSeconds: 5,
  cacheName: "orders",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
});

registerRoute(
  ({ url }) =>
    url.origin === "https://carved-rock-fitness-backend.azurewebsites.net",
  (call) => {
    if (useXhr) {
      return new Promise((resolve, reject) => {
        const xmlHttpRequest = new XMLHttpRequest();
        const method =
          typeof call.request === "string"
            ? "GET"
            : call.request.method ?? "GET";
        const body =
          typeof call.request === "string" ? undefined : call.request.body;

        xmlHttpRequest.onload = () => {
          if (
            xmlHttpRequest.response !== null &&
            xmlHttpRequest.status === 200
          ) {
            resolve(xmlHttpRequest.response);
          } else {
            reject({
              status: xmlHttpRequest.status,
              statusText: xmlHttpRequest.statusText,
              response: xmlHttpRequest.response,
            });
          }
        };
        xmlHttpRequest.open(method, call.url?.toString() ?? "");
        xmlHttpRequest.send(body);
      });
    } else {
      return apiNetworkFirst.handle(call);
    }
  }
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
