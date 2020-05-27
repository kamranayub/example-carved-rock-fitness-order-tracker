import { CarvedRockFitnessApi } from "@carved-rock-fitness/shared";

export function orderStatusToThemeColor(
  status: CarvedRockFitnessApi.OrderStatus
) {
  switch (status) {
    case CarvedRockFitnessApi.OrderStatus.Pending:
      return "medium";
    case CarvedRockFitnessApi.OrderStatus.Shipped:
      return "success";
    case CarvedRockFitnessApi.OrderStatus.Delayed:
      return "warning";
    case CarvedRockFitnessApi.OrderStatus.Canceled:
      return "danger";
    default:
      return "dark";
  }
}
