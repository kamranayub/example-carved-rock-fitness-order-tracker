import { FC } from "react";
import React from "react";
import {
  IonContent,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
} from "@ionic/react";

const Layout: FC = ({ children }) => (
  <IonContent>
    <IonSplitPane contentId="main">
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <img
                src="/assets/icon/icon.png"
                alt="Carved Rock Fitness"
                width="32"
                height="32"
                style={{ verticalAlign: "middle" }}
              />{" "}
              Order Tracker
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem routerLink="/orders">My Orders</IonItem>
            <IonItem>Account</IonItem>
            <IonItem>Settings</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
      {children}
    </IonSplitPane>
  </IonContent>
);

export default Layout;
