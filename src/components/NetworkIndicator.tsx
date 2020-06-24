import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { IonToast } from "@ionic/react";
import { useQueryCache } from "react-query";
import { usePrevious, useNetwork } from "react-use";
import { setIonToastPresented } from "../util";

const NetworkIndicator: FC = () => {
  const queryCache = useQueryCache();
  const { online } = useNetwork({ online: true });
  const wasOnline = usePrevious(online);
  const wasOffline = usePrevious(!online);
  const [isOfflineOpen, setIsOfflineOpen] = useState(true);
  const [isOnlineOpen, setIsOnlineOpen] = useState(true);

  useEffect(() => {
    if (wasOffline && online) {
      queryCache.refetchQueries((query) => /orders/.test(query.queryKey[0]));
    }
  }, [online, wasOffline, queryCache]);

  useLayoutEffect(() => {
    // reset initial state due to Ionic
    // lazy loading components
    if (wasOffline === undefined) {
      setIsOfflineOpen(false);
    }
    if (wasOnline === undefined) {
      setIsOnlineOpen(false);
    }

    // check if changed
    if (wasOnline && !online) {
      setIsOfflineOpen(true);
      setIsOnlineOpen(false);
    } else if (wasOffline && online) {
      setIsOnlineOpen(true);
      setIsOfflineOpen(false);
    }
  }, [online, wasOffline, wasOnline]);

  return (
    <>
      <IonToast
        position="bottom"
        isOpen={isOfflineOpen}
        duration={4000}
        onDidPresent={setIonToastPresented}
        onDidDismiss={() => setIsOfflineOpen(false)}
        message="Looks like you went offline, your data may not be up-to-date."
      />
      <IonToast
        position="bottom"
        isOpen={isOnlineOpen}
        duration={4000}
        onDidPresent={setIonToastPresented}
        onDidDismiss={() => setIsOnlineOpen(false)}
        message="You're back online, your data is automatically being updated."
      />
    </>
  );
};

export default NetworkIndicator;
