import { useEffect, FC } from "react";
import useServiceWorkerBypass from "../use-sw-bypass";

const CypressTestHooks: FC = () => {
  const [, setSwBypass] = useServiceWorkerBypass();

  useEffect(() => {

    // This will not take effect when service worker serves
    // the index.html route, only when SW bypass is enabled
    if ("Cypress" in window) {
      if (window.location.search.indexOf("cy_sw_bypass") > -1) {
        console.debug("Cypress flag: cy_sw_bypass", true);
        setSwBypass(true);
      } else {
        console.debug("Cypress flag: cy_sw_bypass", false);
        setSwBypass(false);
      }
    } else {
      setSwBypass(false);
    }
  }, [setSwBypass]);

  return null;
};

export default CypressTestHooks;
