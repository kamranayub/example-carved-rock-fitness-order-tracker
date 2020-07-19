interface Window {

  /**
   * Global Cypress hook to initialize the app manually, after performing pre-initialize routines
   */
  __CY_INITIALIZE_APP?: () => void;
  
  /**
   * Global Cypress hook to notify runner that a notification has been pushed
   */
  __CY_NOTIFICATION_PUSHED?: (n: string) => void;
}
