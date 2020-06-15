import { FC } from "react";
import React from "react";
import { IonCol } from "@ionic/react";
import { createGlobalState } from "react-use";

import "./HeroImageCol.css";

export const useHeroImage = createGlobalState<string>("");

const HeroImageCol: FC = () => {
  const [heroImage] = useHeroImage();

  return (
    <IonCol
      className="ion-hide-md-down hero-image-col"
      style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}
    >
      <img src="/assets/logo-white.svg" alt="Carved Rock Fitness logo" />
    </IonCol>
  );
};

export default HeroImageCol;
