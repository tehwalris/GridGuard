import { createStyles } from "@mantine/core";
import { State } from "power-shared";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  border: { border: "1px solid black" },
}));

interface Props {
  state: State;
}

function UserContent({ state }: Props) {
  const { classes } = useStyles();

  return <div className={classes.container}>Details</div>;
}

export default UserContent;
