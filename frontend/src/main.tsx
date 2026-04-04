/**
 * Frontend entry point (no Apollo Client)
 * We keep the frontend minimal and use fetch to call the GraphQL backend.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);