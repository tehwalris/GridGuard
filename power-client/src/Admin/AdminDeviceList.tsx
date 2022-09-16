import { Stack, createStyles } from "@mantine/core";
import React from "react";
import AdminDevice from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

function AdminNumberBox() {
  const { classes } = useStyles();

  return (
    <Stack p="lg" className={classes.container}>
      Devices
      <AdminDevice />
      <AdminDevice />
      <AdminDevice />
      <AdminDevice />
    </Stack>
  );
}

export default AdminNumberBox;
