import {
  Box,
  Burger,
  Center,
  createStyles,
  Drawer,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { colors } from "../colors";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.primary1,
    color: theme.colors.contrast1,
  },
}));

function UserHeader() {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <Box className={classes.container} p="md">
      <Burger
        opened={opened}
        onClick={() => setOpened((o) => !o)}
        color={colors.contrast1![0]}
      />
      <Center p="md">
        <Text size={25}>GRIDGUARD</Text>
      </Center>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        size="sm"
      >
        <Stack>
          <Link to="home" onClick={() => setOpened(false)}>
            Home
          </Link>
          <Link to="details" onClick={() => setOpened(false)}>
            Details
          </Link>
        </Stack>
      </Drawer>
    </Box>
  );
}

export default UserHeader;
