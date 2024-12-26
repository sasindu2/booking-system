import React from "react";
import UserForm from "./pages/Booking/Booking";
import Admin from "./pages/Admin/Admin";
import AcceptPage from "./pages/components/accept/acceptbookings";
import DonePage from "./pages/components/done/donebookings";
import CompletePage from "./pages/components/complete/completebooking";
import AdminLogin from "./pages/Admin/login";
import ProtectedRoute from "./pages/components/ProtectedRouter";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<UserForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/status/accept" element={<AcceptPage />} />
          <Route path="/status/done" element={<DonePage />} />
          <Route path="/status/completed" element={<CompletePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
