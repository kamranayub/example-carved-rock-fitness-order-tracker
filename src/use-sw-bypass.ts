import { useSessionStorage } from "react-use";

export default function useServiceWorkerBypass() {
  return useSessionStorage("sw_bypass", false);
}
