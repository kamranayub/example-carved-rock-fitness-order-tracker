import React, { FC } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { OrderStatus } from "../data/api";
import { orderStatusToThemeColor } from "../data/orderStatusToThemeColor";

const OrderStatusContent: FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case OrderStatus.Pending:
      return (
        <p>We've received your order and we're getting it ready for you!</p>
      );
    case OrderStatus.Canceled:
      return <p>This order was canceled. We hope to see you again soon!</p>;
    case OrderStatus.Delayed:
      return (
        <p>
          We are extremely sorry but there have been some delays in processing
          your order, we will notify you when your order ships.
        </p>
      );
    case OrderStatus.Delivered:
      return (
        <p>Your order has been delivered, we hope to see you again soon!</p>
      );
    case OrderStatus.Shipped:
      return <p>Your order is on its way, how exciting!</p>;
    default:
      return <p>{status}</p>;
  }
};

const OrderStatusCard: FC<{ status: OrderStatus }> = ({ status }) => {
  return (
    <IonCard color={orderStatusToThemeColor(status)}>
      <IonCardHeader>
        <IonCardSubtitle>Status</IonCardSubtitle>
        <IonCardTitle>{status}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <OrderStatusContent status={status} />
      </IonCardContent>
    </IonCard>
  );
};

export default OrderStatusCard;
