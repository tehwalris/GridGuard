import { Burger, Center, createStyles, Drawer, Text } from "@mantine/core";
import React, { useState } from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
}));

function UserHeader() {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <div className={classes.container}>
      <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
      <Center p="md">
        <Text size={25}>Title</Text>
      </Center>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        size="sm"
      >
        asdf
      </Drawer>
    </div>
  );
}

export default UserHeader;
