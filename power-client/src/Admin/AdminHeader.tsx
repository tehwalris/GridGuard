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
    height: "100%",
  },
}));

function AdminHeader() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Center inline className={classes.logo}>
        <Box p="md" pl="xl">
          <img height={80} src="Logo.svg" alt="" />
        </Box>
      </Center>
    </div>
  );
}

export default AdminHeader;
