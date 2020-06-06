import React, { useEffect, FC, useState, useLayoutEffect } from "react";
import { IonToast } from "@ionic/react";
import { useSessionStorage, useLocalStorage } from "react-use";
import useIsAppInstalled from "../use-is-app-installed";

/**
 * Customize the PWA installation prompt. Only supported in Chrome and Android.
 */
const InstallationPrompt: FC = () => {
  const [
    deferredPrompt,
    setDeferredPrompt,
  ] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallToast, setShowInstallToast] = useState(true);
  const [hasDismissed, setHasDismissed] = useSessionStorage(
    "dismissedInstallPrompt",
    false
  );
  const isAppInstalled = useIsAppInstalled();
  const [hasInstalled, setHasInstalled] = useLocalStorage(
    "userInstalled",
    isAppInstalled
  );

  // If user has previously dismissed this prompt for the session,
  // don't bother them again. If the app is installed, we don't need to prompt.
  const ignorePrompt = hasDismissed || isAppInstalled || hasInstalled;

  useLayoutEffect(() => {
    setShowInstallToast(false);
  }, []);

  useEffect(() => {
    // if we haven't marked ourselves as installed
    // and the status changes, update it for next launch
    if (!hasInstalled && isAppInstalled) {
      setHasInstalled(true);
    }
  }, [isAppInstalled, hasInstalled, setHasInstalled]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstallToast(true);
    };

    if (ignorePrompt) {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      return;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [ignorePrompt]);

  return (
    <IonToast
      isOpen={showInstallToast}
      message="Install this app for faster access next time"
      onDidDismiss={() => setShowInstallToast(false)}
      position="bottom"
      buttons={[
        {
          side: "start",
          icon: "download-outline",
          text: "Install Now",
          handler: async () => {
            deferredPrompt?.prompt();

            const userChoice = await deferredPrompt?.userChoice;

            if (userChoice?.outcome === "accepted") {
              console.log("User accepted the install prompt");
              setHasInstalled(true);
            } else {
              console.log("User dismissed the install prompt");
              setHasDismissed(true);
            }

            return true;
          },
        },
        {
          text: "Maybe Later",
          role: "cancel",
          handler: () => {
            setHasDismissed(true);
          },
        },
      ]}
    />
  );
};

export default InstallationPrompt;
