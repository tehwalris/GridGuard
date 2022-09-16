import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Admin from "./Admin/Admin";
import User from "./User/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/"
          element={
            <ul>
              <li>
                <Link to="/user">User</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            </ul>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
