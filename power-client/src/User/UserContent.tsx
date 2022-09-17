import { Box, createStyles } from "@mantine/core";
import { State } from "power-shared";
import { Route, Routes } from "react-router-dom";
import UserDetails from "./UserDetails";
import UserHome from "./UserHome";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    backgroundColor: theme.colors.contrast1,
    height: "100%",
  },
}));

interface Props {
  state: State;
}

function UserContent({ state }: Props) {
  const { classes } = useStyles();

  return (
    <Box className={classes.container} p="md">
      <Routes>
        <Route path="home" element={<UserHome state={state} />} />
        <Route path="details" element={<UserDetails state={state} />} />
      </Routes>
    </Box>
  );
}

export default UserContent;
