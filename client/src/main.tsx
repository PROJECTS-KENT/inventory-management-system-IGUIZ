import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { CartProvider } from "./customer/context/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>

      <CartProvider>

        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        <App />

      </CartProvider>

    </BrowserRouter>
  </React.StrictMode>
);