import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Admin from "./Admin/Admin";
import { colors } from "./colors";
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
  const { state, runAction, userId } = useUnilog(wsUrl);

  return (
    <MantineProvider
      theme={{
        colors: colors,
        primaryColor: "primary1",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="user/*"
            element={<User state={state} userId={userId!} />}
          />
          <Route
            path="admin/*"
            element={<Admin state={state} runAction={runAction} />}
          />
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
    </MantineProvider>
  );
}

export default App;
