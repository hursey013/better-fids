import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Prevent page from being reloaded
window.stop();
setTimeout(() => window.location.reload(), 3 * 60 * 1000);

if (process.env.NODE_ENV === "development") {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
} else {
  const ref = document.querySelector(
    "body > center > table:nth-child(2) tr:nth-child(2)"
  );
  const app = document.createElement("tr");
  app.id = "root";
  ref.parentNode.insertBefore(app, ref.nextSibling);
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
