import { createRoot } from "react-dom/client";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import App from "./App.tsx";
import "./index.css";

const host = new URL(location.href).searchParams.get("host");


createRoot(document.getElementById("root")!).render(
    <AppProvider i18n={enTranslations}>
        <App />
    </AppProvider>
);

