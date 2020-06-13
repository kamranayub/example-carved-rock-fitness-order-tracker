import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  useIonViewWillEnter,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";

import OrderDetailsContainer, {
  OrderDetailsRouteParams,
} from "../components/OrderDetailsContainer";
import OrderNotifications from "../components/OrderNotifications";

import { useHeroImage } from "../components/HeroImageCol";

const OrderDetails: React.FC<RouteComponentProps<OrderDetailsRouteParams>> = (
  props
) => {
  const [, setHeroImage] = useHeroImage();

  useIonViewWillEnter(() => setHeroImage("/assets/hero-2.png"));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" />
          </IonButtons>
          <IonTitle>Order #{props.match.params.id}</IonTitle>
          <IonButtons slot="end">
            <OrderNotifications orderId={props.match.params.id} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <OrderDetailsContainer {...props} />
      </IonContent>
    </IonPage>
  );
};
export default OrderDetails;
