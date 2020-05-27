import { CarvedRockFitnessApi } from "@carved-rock-fitness/shared";

export async function getOrders() {
  const res = await fetch("https://carved-rock-fitness-backend.azurewebsites.net/api/orders");
  if (res.ok) {
    const orders: CarvedRockFitnessApi.Order[] = await res.json();
    return orders;
  }

  throw new Error(res.statusText);
}

export async function getOrder(_: string, id: number) {
  const res = await fetch("https://carved-rock-fitness-backend.azurewebsites.net/api/orders/" + id);
  if (res.ok) {
    const order: CarvedRockFitnessApi.Order = await res.json();
    return order || undefined;
  }

  throw new Error(res.statusText);
}
