import React, { FC } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { RouteComponentProps } from "react-router";

import ORDER_DATA from '../data/orders'
import OrderStatusBadge from "./OrderStatusBadge";

export const OrdersContainer: FC<RouteComponentProps> = (props) => {
  return (
    <>
      <IonList>
        {ORDER_DATA.map(order => (
        <IonItem>
          <IonLabel>
            <h1>Order #{order.id}</h1>
          </IonLabel>
          <OrderStatusBadge status={order.status} slot="end" />
        </IonItem>))}
      </IonList>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => props.history.push('/new')}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  );
};

export default OrdersContainer;
