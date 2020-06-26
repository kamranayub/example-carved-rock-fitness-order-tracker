import { useEffect, FC } from "react";
import useServiceWorkerBypass from "../use-sw-bypass";

declare global {
    interface Window {
      /**
       * Global Cypress hook to bypass Service Worker route caching
       */
      __CY_DISABLE_SW_API_CACHING?: boolean;
    }
  }

const CypressTestHooks: FC = () => {
  const [, setSwBypass] = useServiceWorkerBypass();

  useEffect(() => {
    if ("Cypress" in window) {
      console.debug("App is running under Cypress, enabling test globals");

      if (typeof window.__CY_DISABLE_SW_API_CACHING !== "undefined") {
        console.debug(
          "window.__CY_DISABLE_SW_API_CACHING",
          window.__CY_DISABLE_SW_API_CACHING
        );
        setSwBypass(window.__CY_DISABLE_SW_API_CACHING);
      }
    }

    return () => {
      if ("Cypress" in window) {
        delete window.__CY_DISABLE_SW_API_CACHING;
      }
    };
  });

  return null;
};

export default CypressTestHooks;
