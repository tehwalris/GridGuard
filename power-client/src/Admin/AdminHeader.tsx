import { Box, Center, createStyles } from "@mantine/core";

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
  logo: {
    width: 300,
    height: "100%",
    border: "1px solid black",
  },
  title: {
    height: "100%",
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: 2,
  },
}));

function AdminHeader() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Center className={classes.logo}>Logo</Center>
      <Center inline className={classes.title}>
        <Box p="lg">OPERATION Needlepoint</Box>
      </Center>
    </div>
  );
}

export default AdminHeader;
