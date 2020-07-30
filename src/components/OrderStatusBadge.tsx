import React, { FC } from "react";
import { IonBadge } from "@ionic/react";
import { OrderStatus } from "../data/api";
import { orderStatusToThemeColor } from "../data/orderStatusToThemeColor";

interface OrderStatusProps {
  slot?: string;
  status: OrderStatus;
}

const OrderStatusBadge: FC<OrderStatusProps> = ({ slot, status }) => {
  return (
    <IonBadge color={orderStatusToThemeColor(status)} slot={slot}>
      {status}
    </IonBadge>
  );
};

export default OrderStatusBadge;
