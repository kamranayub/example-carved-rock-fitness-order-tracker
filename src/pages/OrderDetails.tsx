import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";

import OrderDetailsContainer, {
  OrderDetailsRouteParams,
} from "../components/OrderDetailsContainer";

const OrderDetails: React.FC<RouteComponentProps<OrderDetailsRouteParams>> = (
  props
) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Order #{props.match.params.id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <OrderDetailsContainer {...props} />
      </IonContent>
    </IonPage>
  );
};
export default OrderDetails;
