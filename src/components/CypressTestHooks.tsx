import { useEffect, FC, useRef } from "react";
import useServiceWorkerBypass from "../use-sw-bypass";

const CypressTestHooks: FC = () => {
  const [, setSwBypass] = useServiceWorkerBypass();

  useEffect(() => {
    if ("Cypress" in window) {
      console.debug("App is running under Cypress, enabling test globals:");

      if (window.location.search.indexOf("sw_bypass") > -1) {
        console.debug("- sw_bypass");
        setSwBypass(true);
      }
    }
  }, [setSwBypass]);

  return null;
};

export default CypressTestHooks;
