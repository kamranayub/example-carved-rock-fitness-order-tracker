import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import NetworkIndicator from "./components/NetworkIndicator";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Layout from "./components/Layout";
import InstallationPrompt from "./components/InstallationPrompt";
import CypressTestHooks from "./components/CypressTestHooks";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Layout>
        <IonRouterOutlet>
          <Route path="/orders" component={Orders} exact />
          <Route path="/orders/:id" component={OrderDetails} exact />
          <Route exact path="/" render={() => <Redirect to="/orders" />} />
        </IonRouterOutlet>
      </Layout>
    </IonReactRouter>
    <NetworkIndicator />
    <InstallationPrompt />
    <CypressTestHooks />
  </IonApp>
);

export default App;
