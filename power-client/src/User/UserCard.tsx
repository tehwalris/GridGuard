import { Box, createStyles } from "@mantine/core";

const useStyles = createStyles(
  (
    theme,
    { backgroundColor }: { backgroundColor: string | undefined },
    getRef,
  ) => ({
    container: {
      backgroundColor: backgroundColor || "white",
      borderRadius: 20,
      boxShadow: "0px 0px 5px " + theme.colors.contrast2[0],
    },
  }),
);

function UserCard(
  props: React.PropsWithChildren<{ backgroundColor?: string }>,
) {
  const { classes } = useStyles({ backgroundColor: props.backgroundColor });

  return (
    <Box p="lg" className={classes.container}>
      {props.children}
    </Box>
  );
}

export default UserCard;
