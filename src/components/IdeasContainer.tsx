import React, { FC } from "react";
import {
  IonList,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonNote,
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { RouteComponentProps } from "react-router";

export const IdeasContainer: FC<RouteComponentProps> = (props) => {
  return (
    <>
      <IonList>
        <IonItem>
          <IonCheckbox slot="start" />
          <IonLabel>
            <h1>Create Idea</h1>
            <IonNote>Run Idea by Brandy</IonNote>
          </IonLabel>
          <IonBadge color="success" slot="end">
            5 Days
          </IonBadge>
        </IonItem>
      </IonList>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => props.history.push('/new')}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  );
};

export default IdeasContainer;
