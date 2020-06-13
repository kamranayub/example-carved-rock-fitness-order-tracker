import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  useIonViewWillEnter,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import { useHeroImage } from "../components/HeroImageCol";
import OrdersContainer from "../components/OrdersContainer";

const Orders: React.FC<RouteComponentProps> = (props) => {
  const [, setHeroImage] = useHeroImage();

  useIonViewWillEnter(() => {
    setHeroImage("/assets/hero-1.png");
  });

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>My Orders</IonTitle>
          </IonToolbar>
        </IonHeader>
        <OrdersContainer {...props} />
      </IonContent>
    </IonPage>
  );
};

export default Orders;
