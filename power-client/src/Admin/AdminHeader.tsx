import { Box, Center, createStyles } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 300,
    height: "100%",
    border: "1px solid black",
  },
  title: {
    height: "100%",
    border: "1px solid black",
  },
}));

function AdminHeader() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Center className={classes.logo}>Logo</Center>
      <Center inline className={classes.title}>
        <Box p="lg">Back to Mantine website</Box>
      </Center>
    </div>
  );
}

export default AdminHeader;
