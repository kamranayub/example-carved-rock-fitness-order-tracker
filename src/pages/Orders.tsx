import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import OrdersContainer from "../components/OrdersContainer";
import "./Orders.css";

const Orders: React.FC<RouteComponentProps> = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Orders</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Orders</IonTitle>
          </IonToolbar>
        </IonHeader>
        <OrdersContainer {...props} />
      </IonContent>
    </IonPage>
  );
};

export default Orders;
