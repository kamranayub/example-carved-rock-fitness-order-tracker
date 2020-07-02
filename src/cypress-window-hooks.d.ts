interface Window {
  /**
   * Global Cypress hook to bypass Service Worker route caching
   */
  __CY_DISABLE_SW_API_CACHING?: boolean;

  /**
   * Global Cypress hook to notify runner that a notification has been pushed
   */
  __CY_NOTIFICATION_PUSHED?: (n: string) => void;
}
