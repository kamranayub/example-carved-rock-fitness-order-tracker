import { useSessionStorage } from "react-use";

/**
 * Hook to store and retrieve whether or not we should enable
 * Service Worker bypass flag for external requests.
 */
export default function useServiceWorkerBypass() {
  return useSessionStorage("cy_sw_bypass", false);
}
