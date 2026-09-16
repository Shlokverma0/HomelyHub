import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/Property/PropertyDetails/store.js";
import {Provider} from "react-redux";
import "./css/responsive.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <Provider store={store}>
    <App/>
  </Provider>
  </StrictMode>
);

