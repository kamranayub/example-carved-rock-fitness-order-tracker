import { IonToggle, IonToast, IonIcon } from "@ionic/react";
import React, { FC, useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "react-use";
import { notificationsOff, notifications } from "ionicons/icons";
import { OrderStatus } from "../data/api";
import { subscribeToOrder, getOrder } from "../data/orders";
import { useQuery } from "react-query";
import useServiceWorkerBypass from "../use-sw-bypass";
import usePermission from "../use-permission";
import { setIonToastPresented } from "../util";

interface OrderNotificationsProps {
  orderId: string;
}

function canTrackOrder(orderStatus: OrderStatus) {
  switch (orderStatus) {
    case OrderStatus.Canceled:
      return false;
    case OrderStatus.Delivered:
      return false;
    default:
      return true;
  }
}

/**
 * Wraps Notification.requestPermission for Safari compatibility
 * and returns "denied" if notifications are unsupported
 */
async function requestNotificationPermission() {
  if ("Notification" in window) {
    const requestPromise = new Promise((resolve) =>
      Notification.requestPermission(resolve)
    );

    const result = await requestPromise;
    if (!result) {
      // In Safari, we have to re-check the permission state
      return Notification.permission;
    }
    return result;
  }
  return Promise.resolve("denied"); // unsupported
}

function useNotificationPermission() {
  const notificationPermission = usePermission({ name: "notifications" });

  if (!navigator.permissions?.query && "Notification" in window) {
    // Safari mostly, since it doesn't support Permissions API
    const localPermission = Notification.permission;

    if (!notificationPermission) {
      return localPermission;
    }
  }

  return notificationPermission;
}

function sendTestNotification(orderId: string) {
  //
  // Simulate subscribing to an order from the server
  //
  subscribeToOrder(
    parseInt(orderId, 10),

    // We are passing an order status to send via notification for demo purposes
    OrderStatus.Shipped
  );
}

const OrderNotifications: FC<OrderNotificationsProps> = ({ orderId }) => {
  const [swBypass] = useServiceWorkerBypass();
  const { data: order } = useQuery(
    ["order", parseInt(orderId, 10)],
    [swBypass],
    getOrder
  );
  const [
    enableNotifications,
    setEnableNotifications,
    unsetEnableNotifications,
  ] = useLocalStorage("notifications/orders/" + orderId, false);
  const notificationPermission = useNotificationPermission();
  const [isPermissionGranted, setIsPermissionGranted] = useState(
    notificationPermission === "granted"
  );
  const [showDeniedToast, setShowDeniedToast] = useState(false);
  const [
    showEnableNotificationToast,
    setShowEnableNotificationToast,
  ] = useState(false);
  const [
    showDisableNotificationToast,
    setShowDisableNotificationToast,
  ] = useState(false);

  const handleToggleClick = useCallback(
    async (e) => {
      e.preventDefault();

      const willBeEnabled = !enableNotifications;

      // check for permissions
      if (isPermissionGranted) {
        setEnableNotifications(willBeEnabled);

        if (willBeEnabled) {
          setShowEnableNotificationToast(true);
          setShowDisableNotificationToast(false);
          sendTestNotification(orderId);
        } else {
          setShowDisableNotificationToast(true);
          setShowEnableNotificationToast(false);
        }
      } else if (
        willBeEnabled &&
        (notificationPermission === "prompt" ||
          notificationPermission === "default")
      ) {
        const promptPermission = await requestNotificationPermission();

        if (promptPermission === "granted") {
          if (willBeEnabled) {
            setEnableNotifications(true);
            setShowEnableNotificationToast(true);
            sendTestNotification(orderId);
          }
          setIsPermissionGranted(true);
        } else {
          setIsPermissionGranted(false);
          setShowDeniedToast(true);
          unsetEnableNotifications();
        }
      } else if (notificationPermission === "denied") {
        if (!willBeEnabled) {
          setIsPermissionGranted(false);
          setEnableNotifications(false);
        } else {
          setShowDeniedToast(true);
        }
      } else if (!willBeEnabled) {
        unsetEnableNotifications();
      }
    },
    [
      orderId,
      isPermissionGranted,
      notificationPermission,
      enableNotifications,
      setEnableNotifications,
      unsetEnableNotifications,
    ]
  );

  useEffect(() => {
    if (notificationPermission === "granted") {
      setIsPermissionGranted(true);
    }
  }, [notificationPermission]);

  return (
    <>
      <IonIcon icon={enableNotifications ? notifications : notificationsOff} />
      <IonToggle
        disabled={order ? !canTrackOrder(order.status) : true}
        checked={enableNotifications}
        onClick={handleToggleClick}
        style={{
          "--background":
            notificationPermission === "denied"
              ? "var(--ion-color-danger)"
              : undefined,
          "--background-checked": "var(--ion-color-success)",
        }}
        aria-label="Toggle Push Notifications"
        value={orderId}
      />
      <IonToast
        message="We will notify you of any updates to this order"
        onDidPresent={setIonToastPresented}
        isOpen={showEnableNotificationToast}
        duration={2000}
        color="success"
      />
      <IonToast
        message="You will no longer receive updates for this order"
        onDidPresent={setIonToastPresented}
        isOpen={showDisableNotificationToast}
        duration={2000}
        color="success"
      />
      <IonToast
        message="We'll need permission before we can send you order updates. To enable, check your browser settings for this site."
        onDidPresent={setIonToastPresented}
        isOpen={showDeniedToast}
        duration={5000}
        color="warning"
      />
    </>
  );
};

export default OrderNotifications;
