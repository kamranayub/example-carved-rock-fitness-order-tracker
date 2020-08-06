import { queryCache } from "react-query";
import { Order, OrderStatus } from "./api";

/**
 * Helper to build CRF API URL
 *
 * @param path API path
 * @param bypassServiceWorkerCaching Whether or not to hint to service worker to bypass caching for the request
 */
function url(path: string, bypassServiceWorkerCaching?: boolean) {
  const query = bypassServiceWorkerCaching ? "?cy_sw_bypass" : "";

  return path + query;
}

export async function getOrders(_: string, swBypass: boolean) {
  const res = await fetch(url("/api/orders/index.json", swBypass));
  if (res.ok) {
    const orders: Order[] = await res.json();
    return orders;
  }

  throw new Error(res.statusText);
}

export async function getOrder(_: string, id: number, swBypass: boolean) {
  const res = await fetch(url(`/api/orders/${id}.json`, swBypass));
  if (res.ok) {
    const order: Order = await res.json();
    return order || undefined;
  }

  throw new Error(res.statusText);
}

/**
 * Simulates subscribing to an order. Normally, this could be done using Web Push.
 *
 * In order to keep things a bit simpler for this demo of notifications, I am not using Web Push.
 * However, Web Push uses the same underlying Notifications API, it just requires more sophisticated setup.
 * It can be tested in the same way!
 *
 * @param id The order to subscribe to
 * @param status The status to forcefully update to (this wouldn't normally be provided by the client!)
 */
export function subscribeToOrder(id: number, status: OrderStatus) {
  setTimeout(() => {
    queryCache.setQueryData<Order>(["order", id], (existingOrder) => {
      if (existingOrder) {
        const title = `Order #${existingOrder.id} Status`;
        const body = `Your order with ${existingOrder.orderItems.length} items is now "${status}"`;
        try {
          const n = new Notification(title, {
            body,
          });

          n.addEventListener("show", () => {
            if (typeof window.__CY_NOTIFICATION_PUSHED !== "undefined") {
              window.__CY_NOTIFICATION_PUSHED(n.body);
            }
          });
        } catch (error) {
          // On mobile Chrome, you must use serviceWorkerRegistration.showNotification(). In reality, you'd probably do this instead of a "local" Notification above for all devices but this is an example of both
          //
          // Notably you can't listen to any events from this, but
          // you can use registration.getNotifications() to check what
          // was sent previously.
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
            });
          });
        }

        return { ...existingOrder, status };
      } else {
        throw new Error(`Order with ID ${id} not found in cache`);
      }
    });
  }, 5000);
}
