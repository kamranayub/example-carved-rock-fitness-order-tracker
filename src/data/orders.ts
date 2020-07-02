import { CarvedRockFitnessApi } from "@carved-rock-fitness/shared";
import { queryCache } from "react-query";

/**
 * Helper to build CRF API URL
 *
 * @param path API path
 * @param bypassServiceWorkerCaching Whether or not to hint to service worker to bypass caching for the request
 */
function url(path: string, bypassServiceWorkerCaching?: boolean) {
  const base = "https://carved-rock-fitness-backend.azurewebsites.net";
  const query = bypassServiceWorkerCaching ? "?sw_bypass" : "";

  return base + path + query;
}

export async function getOrders(_: string, swBypass: boolean) {
  const res = await fetch(url("/api/orders", swBypass));
  if (res.ok) {
    const orders: CarvedRockFitnessApi.Order[] = await res.json();
    return orders;
  }

  throw new Error(res.statusText);
}

export async function getOrder(_: string, id: number, swBypass: boolean) {
  const res = await fetch(url("/api/orders/" + id, swBypass));
  if (res.ok) {
    const order: CarvedRockFitnessApi.Order = await res.json();
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
export function subscribeToOrder(
  id: number,
  status: CarvedRockFitnessApi.OrderStatus
) {
  setTimeout(() => {
    queryCache.setQueryData<CarvedRockFitnessApi.Order>(
      ["order", id],
      (existingOrder) => {
        if (existingOrder) {
          const n = new Notification(`Order #${existingOrder.id} Status`, {
            body: `Your order with ${existingOrder.orderItems.length} items is now "${status}"`,
          });

          n.addEventListener("show", () => {
            console.log("notification shown!", n);
            if (typeof window.__CY_NOTIFICATION_PUSHED !== "undefined") {
              window.__CY_NOTIFICATION_PUSHED(n);
            }
          });

          return { ...existingOrder, status };
        } else {
          throw new Error(`Order with ID ${id} not found in cache`);
        }
      }
    );
  }, 5000);
}
