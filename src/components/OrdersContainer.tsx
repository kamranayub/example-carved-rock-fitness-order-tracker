import React, { FC } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";

import ORDER_DATA from "../data/orders";
import OrderStatusBadge from "./OrderStatusBadge";
import Amount from "./Amount";

export const OrdersContainer: FC<RouteComponentProps> = (props) => {
  return (
    <>
      <IonList>
        {ORDER_DATA.map((order) => (
          <IonItem>
            <IonLabel>
              <h1>Order #{order.id}</h1>
              <IonNote>
                {order.orderItems.length} items &bull;{" "}
                <Amount amount={order.total} />
              </IonNote>
            </IonLabel>
            <OrderStatusBadge status={order.status} slot="end" />
          </IonItem>
        ))}
      </IonList>
    </>
  );
};

export default OrdersContainer;
