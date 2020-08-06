import React, { useEffect, FC, useState, useLayoutEffect } from "react";
import { IonToast } from "@ionic/react";
import { useSessionStorage, useLocalStorage } from "react-use";
import useIsAppInstalled from "../use-is-app-installed";
import { setIonToastPresented } from "../util";

/**
 * Customize the PWA installation prompt. Supported in Chrome and Android. For iOS or devices that do not support onbeforeinstallprompt, a generic toast is shown and automatically dismissed.
 */
const InstallationPrompt: FC = () => {
  const [
    deferredPrompt,
    setDeferredPrompt,
  ] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallToast, setShowInstallToast] = useState(true);
  const [showGenericInstallToast, setShowGenericInstallToast] = useState(false);
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

      // Check if install status has changed
      if (hasDismissed || isAppInstalled || hasInstalled) {
        return;
      }

      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowInstallToast(true);
    };

    // Has already dismissed or installed
    if (ignorePrompt) {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      return;
    }

    if ("onbeforeinstallprompt" in window) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    } else {
      // Show a generic toast prompt that auto-dismisses
      // just for testing on devices that don't support customized
      // prompts
      setShowGenericInstallToast(true);
    }

    return () => {
      if ("onbeforeinstallprompt" in window) {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      }
    };
  }, [ignorePrompt, hasDismissed, hasInstalled, isAppInstalled]);

  return (
    <>
      <IonToast
        isOpen={showInstallToast}
        message="Install this app for faster access next time"
        onDidPresent={setIonToastPresented}
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

      <IonToast
        isOpen={showGenericInstallToast}
        message="Add this app to your homescreen for faster access!"
        onDidPresent={setIonToastPresented}
        onDidDismiss={() => {
          setShowGenericInstallToast(false);
          setHasDismissed(true);
        }}
        position="bottom"
        duration={6000}
      />
    </>
  );
};

export default InstallationPrompt;
