import { useEffect, useState } from "react";
import useDisplayMode from "./use-display-mode";

/**
 * Whether or not the PWA has just been installed
 */
export default function useIsAppInstalled() {
  const displayMode = useDisplayMode();
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  });

  useEffect(() => {
    if (displayMode !== "browser tab") {
      setIsAppInstalled(true);
    }
  }, [displayMode]);

  return isAppInstalled;
}
