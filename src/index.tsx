import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

function initializeApp() {
  ReactDOM.render(<App />, document.getElementById("root"));
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA

  // Add class names for Cypress' benefit
  // to check whether service worker is ready
  serviceWorker.register({
    onSuccess() {
      document.querySelector("html")?.classList.add("sw", "sw-registered");
    },
    onUpdate() {
      document.querySelector("html")?.classList.add("sw", "sw-updated");
    },
    onReady() {
      document.querySelector("html")?.classList.add("sw", "sw-ready");
    },
  });
}

//
// Immediately check if orders cache existed on load
// before registering SW or loading app to help prevent
// race conditions.
//
if ("Cypress" in window) {
  window.caches.has("orders").then((exists) => {
    if (exists) {
      document.querySelector("html")?.classList.add("sw-orders-cache-exists");
    }
    initializeApp();
  });
} else {
  initializeApp();
}

//
// For static files outside webpack/React
// we can load them into cache.
//
// This is a naive way, ideally we'd read from
// a manifest or import using webpack when using these,
// besides favicons.
//
window.addEventListener("load", () => {
  const addImagesToCache = async (urls: string[]) => {
    const imageCache = await window.caches.open("images");
    await imageCache.addAll(urls);
  };

  if (window.caches) {
    addImagesToCache([
      "/assets/hero-1.jpg",
      "/assets/hero-2.jpg",
      "/assets/logo-white.svg",
      "/assets/logo-yellow.svg",
      "/assets/pluralsight-white.png",
      "/assets/icon/favicon.png",
      "/assets/icon/icon-144.png",
      "/assets/icon/icon.png",
      "/assets/icon/icon-solid-white.svg",
    ]);
  }
});
