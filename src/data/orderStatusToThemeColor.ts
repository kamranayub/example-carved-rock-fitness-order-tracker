import { OrderStatus } from "./orders";
export function orderStatusToThemeColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Pending:
      return "medium";
    case OrderStatus.Shipped:
      return "success";
    case OrderStatus.Delayed:
      return "warning";
    case OrderStatus.Canceled:
      return "danger";
    default:
      return "dark";
  }
}
