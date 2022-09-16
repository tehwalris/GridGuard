import { Stack, createStyles } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

function AdminDevice() {
  const { classes } = useStyles();

  return <div>Device X</div>;
}

export default AdminDevice;
