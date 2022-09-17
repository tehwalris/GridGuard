import { createStyles, Group } from "@mantine/core";
import { State } from "power-shared";
import { Route, Routes } from "react-router-dom";
import UserDetails from "./UserDetails";
import UserHome from "./UserHome";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    backgroundColor: theme.colors.contrast1,
    height: "100%",
    position: "relative",
  },
}));

interface Props {
  state: State;
  userId: string;
}

function UserContent({ state, userId }: Props) {
  const { classes } = useStyles();

  return (
    <Group className={classes.container}>
      <Routes>
        <Route
          path="home"
          element={<UserHome state={state} userId={userId} />}
        />
        <Route
          path="details"
          element={<UserDetails state={state} userId={userId} />}
        />
      </Routes>
    </Group>
  );
}

export default UserContent;
