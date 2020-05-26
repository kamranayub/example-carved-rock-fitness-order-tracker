import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/react";
import React from "react";

const NewItem: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>New Item</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent></IonContent>
      </IonPage>
    );
  };
  export default NewItem;