import { useState, useEffect } from "react";

export type DisplayMode =
  | "browser tab"
  | "standalone-ios"
  | "standalone"
  | undefined;

/**
 * The display mode the PWA has been launched in. Will be `standalone` or `standalone-ios` if
 * launched from the home screen.
 */
export default function useDisplayMode(): DisplayMode {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("browser tab");

  useEffect(() => {
    const handleDisplayModeMedia = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setDisplayMode("standalone");
      } else {
        setDisplayMode("browser tab");
      }
    };

    const handleLoaded = () => {
      if (navigator.standalone) {
        setDisplayMode("standalone-ios");
      }
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setDisplayMode("standalone");
      }
      window
        .matchMedia("(display-mode: standalone)")
        .addListener(handleDisplayModeMedia);
    };

    window.addEventListener("DOMContentLoaded", handleLoaded);

    return () => {
      window.removeEventListener("DOMContentLoaded", handleLoaded);
      window
        .matchMedia("(display-mode: standalone)")
        .removeListener(handleDisplayModeMedia);
    };
  }, []);

  return displayMode;
}
