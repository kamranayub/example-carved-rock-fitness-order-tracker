interface Window {
  /**
   * Global Cypress hook to notify runner that a notification has been pushed
   */
  __CY_NOTIFICATION_PUSHED?: (n: string) => void;
}
