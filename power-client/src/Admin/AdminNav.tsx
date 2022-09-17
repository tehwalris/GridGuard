import { Box, createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    backgroundColor: theme.colors.accent1,
    position: "relative",
  },
  triangle: {
    position: "absolute",
    top: 50,
    right: -15,
    width: 0,
    height: 0,
    borderTop: "20px solid transparent",
    borderLeft: "15px solid " + theme.colors.accent1[0],
    borderBottom: "20px solid transparent",
  },
}));

function AdminNav() {
  const { classes } = useStyles();

  return (
    <Box p="lg" className={classes.container}>
      <div className={classes.triangle} />
      asf
    </Box>
  );
}

export default AdminNav;
