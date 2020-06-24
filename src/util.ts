/**
 * Attaches a data-presented="true" attribute to an ion-toast element
 * to make it easier to find during testing.
 *
 * @param e The event to act upon
 */
export function setIonToastPresented({ target }: CustomEvent<any>) {
  if (target) {
    const el = target as HTMLElement;
    el.dataset.presented = "true";
  }
}
