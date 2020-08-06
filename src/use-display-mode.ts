import { useState, useEffect } from "react";
import { getCacheKeyForURL } from "workbox-precaching";

export type DisplayMode =
  | "browser tab"
  | "standalone-ios"
  | "standalone"
  | undefined;

function getCurrentDisplayMode() {
  let mode: DisplayMode = "browser tab";

  if (navigator.standalone) {
    mode = "standalone-ios";
  }

  if (window.matchMedia("(display-mode: standalone)").matches) {
    mode = "standalone";
  }

  return mode;
}

/**
 * The display mode the PWA has been launched in. Will be `standalone` or `standalone-ios` if
 * launched from the home screen.
 */
export default function useDisplayMode(): DisplayMode {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() =>
    getCurrentDisplayMode()
  );

  useEffect(() => {
    const handleDisplayModeMedia = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setDisplayMode("standalone");
      } else {
        setDisplayMode("browser tab");
      }
    };

    setDisplayMode(getCurrentDisplayMode());

    window
      .matchMedia("(display-mode: standalone)")
      .addListener(handleDisplayModeMedia);

    return () => {
      window
        .matchMedia("(display-mode: standalone)")
        .removeListener(handleDisplayModeMedia);
    };
  }, []);

  return displayMode;
}
