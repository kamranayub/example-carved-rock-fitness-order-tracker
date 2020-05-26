import { OrderStatus } from "../data/orders";
import React, { FC } from "react";
import { IonBadge } from "@ionic/react";

interface OrderStatusProps {
  slot?: string;
  status: OrderStatus;
}

function orderStatusToBadgeColor(status: OrderStatus) {
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

const OrderStatusBadge: FC<OrderStatusProps> = ({ slot, status }) => {
  return (
    <IonBadge color={orderStatusToBadgeColor(status)} slot={slot}>
      {status}
    </IonBadge>
  );
};

export default OrderStatusBadge;
