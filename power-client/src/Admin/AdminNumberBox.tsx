import { Center, createStyles } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: 200, width: "100%", fontSize: 30 },
}));

function AdminNumberBox() {
  const { classes } = useStyles();

  return <Center className={classes.container}>Label: Number</Center>;
}

export default AdminNumberBox;
