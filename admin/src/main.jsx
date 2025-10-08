import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { AdminContextProvider } from "./context/AdminContext.jsx";
import { DoctorContextProvider } from "./context/DoctorContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);

// the order of wrapping context providers matters only if one provider depends on values from another.

// Independent contexts → order doesn’t matter.
// If AdminContext, DoctorContext, and AppContext don’t use each other’s data, you can wrap them in any order.
// Dependent contexts → parent must wrap child.
// Example:
// If DoctorContext needs to know which Admin is logged in, then DoctorContextProvider should be inside AdminContextProvider.
// If AppContext is just general app-level stuff (like theme, user, language), it often goes at the top, so others can use it.
// Practical convention:
// Global AppContext → top (outermost).
// Domain-specific contexts (Admin, Doctor) → inside.
// UI/router-related providers → innermost (closest to App).
