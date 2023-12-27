import React from "react";
import ReactDOM from "react-dom/client";
import { register } from "swiper/element/bundle";

import Providers from "@components/Providers.tsx";

// Register Swiper custom elements
register();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
