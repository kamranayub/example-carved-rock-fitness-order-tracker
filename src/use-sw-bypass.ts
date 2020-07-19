import { useSessionStorage } from "react-use";

export default function useServiceWorkerBypass() {
  return useSessionStorage("cy_sw_bypass", false);
}
