import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

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
      "/assets/hero-1.png",
      "/assets/hero-2.png",
      "/assets/logo.png",
      "/assets/pluralsight-white.png",
      "/assets/icon/favicon.png",
      "/assets/icon/icon-144.png",
      "/assets/icon/icon.png",
      "/assets/icon/icon-white.png",
    ]);
  }
});
