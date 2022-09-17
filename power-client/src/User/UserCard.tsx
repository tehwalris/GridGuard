import { Box, createStyles } from "@mantine/core";

const useStyles = createStyles((theme, params, getRef) => ({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
  },
}));

function UserCard(props: React.PropsWithChildren<{}>) {
  const { classes } = useStyles();

  return (
    <Box p="lg" className={classes.container}>
      {props.children}
    </Box>
  );
}

export default UserCard;
