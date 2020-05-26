import {
  IonContent,
  IonLoading,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonItemGroup,
  IonItemDivider,
} from "@ionic/react";
import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { useQuery } from "react-query";

import { getOrder } from "../data/orders";
import Amount from "../components/Amount";
import OrderStatusCard from "./OrderStatusCard";

export interface OrderDetailsRouteParams {
  id: string;
}

const OrderDetailsContainer: FC<RouteComponentProps<
  OrderDetailsRouteParams
>> = (props) => {
  const { data: order, status } = useQuery(
    ["order", Number(props.match.params.id)],
    getOrder
  );

  return (
    <>
      <IonLoading
        isOpen={status === "loading"}
        message="Loading order details..."
      />
      {order && (
        <IonContent>
          <OrderStatusCard status={order.status} />
          <IonList>
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Items</IonLabel>
              </IonItemDivider>
              {order.orderItems.map((item) => (
                <IonItem>
                  <IonLabel>
                    <h2>{item.productName}</h2>
                    <IonNote>Quantity: {item.qty}</IonNote>
                  </IonLabel>
                  <IonNote color="secondary" slot="end">
                    <Amount amount={item.price} />
                  </IonNote>
                </IonItem>
              ))}
            </IonItemGroup>
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>Summary</IonLabel>
              </IonItemDivider>
              <IonItem>
                <IonLabel>Subtotal</IonLabel>
                <IonNote color="secondary" slot="end">
                  <Amount amount={order.subTotal} />
                </IonNote>
              </IonItem>
              <IonItem>
                <IonLabel>Taxes &amp; Fees</IonLabel>
                <IonNote slot="end">
                  <Amount amount={order.tax} />
                </IonNote>
              </IonItem>
              <IonItem>
                <IonLabel>Total Charged</IonLabel>
                <IonNote color="primary" slot="end">
                  <Amount amount={order.total} />
                </IonNote>
              </IonItem>
            </IonItemGroup>
          </IonList>
        </IonContent>
      )}
    </>
  );
};
export default OrderDetailsContainer;
