import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white selection:bg-[#72DB73] selection:text-black">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

