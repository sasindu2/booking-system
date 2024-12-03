import React from "react";
import UserForm from "./pages/Booking/Booking";
import Admin from "./pages/Admin/Admin";
import AcceptPage from "./pages/components/accept/acceptbookings";
import DonePage from "./pages/components/done/donebookings";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<UserForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/status/accept" element={<AcceptPage />} />
          <Route path="/status/done" element={<DonePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
