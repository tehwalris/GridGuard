import { Center, createStyles } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: 100, width: "100%", fontSize: 30 },
}));

interface Props {
  content: string;
}

function AdminBox({ content }: Props) {
  const { classes } = useStyles();

  return <Center className={classes.container}>{content}</Center>;
}

export default AdminBox;
