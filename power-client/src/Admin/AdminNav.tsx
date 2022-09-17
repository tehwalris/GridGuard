import { createStyles, Stack } from "@mantine/core";
import AdminNavElement from "./AdminNavElement";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    backgroundColor: "white",
    position: "relative",
  },
  triangle: {
    position: "absolute",
    top: 50,
    right: -15,
    width: 0,
    height: 0,
    borderTop: "20px solid transparent",
    borderLeft: "15px solid white",
    borderBottom: "20px solid transparent",
  },
  addSeparator: {
    ":after": {
      content: "''",
      background: theme.colors.contrast2[0],
      width: 260,
      height: 2,
      display: "block",
    },
  },
}));

function AdminNav() {
  const { classes } = useStyles();

  return (
    <Stack className={classes.container}>
      <div className={classes.triangle} />
      <div className={classes.addSeparator}>
        <AdminNavElement to="" label="DASHBOARD" active={true} />
      </div>
      <div className={classes.addSeparator}>
        <AdminNavElement to="" label="SMTH" active={false} />
      </div>
    </Stack>
  );
}

export default AdminNav;
