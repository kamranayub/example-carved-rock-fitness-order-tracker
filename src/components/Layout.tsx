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
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import HeroImageCol from "./HeroImageCol";

import "./Layout.css";

const Layout: FC = ({ children }) => (
  <IonContent>
    <IonSplitPane contentId="main">
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>
              <img
                src="/assets/icon/icon-white.png"
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
          <footer className="pluralsight">
            <img src="/assets/pluralsight-white.png" alt="Pluralsight Logo" />
            <section>
              This site is created for demonstrative purposes only and does not
              offer any real products or services.
            </section>
          </footer>
        </IonContent>
      </IonMenu>
      <IonContent id="main">
        <IonGrid style={{ height: "100%", "--ion-grid-padding": "0px" }}>
          <IonRow style={{ height: "100%" }}>
            <IonCol size="12" sizeMd="8" sizeXl="6">
              {children}
            </IonCol>
            <HeroImageCol />
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonSplitPane>
  </IonContent>
);

export default Layout;
