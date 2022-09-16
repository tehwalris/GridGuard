import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Admin from "./Admin/Admin";
import User from "./User/User";
import { useUnilog } from "./useUnilog";

const serverOrigin =
  process.env.NODE_ENV === "development"
    ? `${window.location.hostname}:8088`
    : window.location.host;
const wsServerBaseUrl = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${serverOrigin}`;

function App() {
  const wsUrl = new URL("./lobbies/HACK", wsServerBaseUrl).href;
  const { state, userId, runAction } = useUnilog(wsUrl);

  console.log("DEBUG unilog", state, userId);

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
