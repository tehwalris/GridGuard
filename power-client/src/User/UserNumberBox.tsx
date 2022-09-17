import { Center, createStyles, Stack } from "@mantine/core";

const useStyles = createStyles((theme, params, getRef) => ({
  container: { height: 50 },
  number: {
    fontSize: 30,
    color: theme.colors.primary1[0],
    textDecoration: "none !important",
  },
  label: {
    fontSize: 12,
    color: theme.colors.contrast2[0],
    textDecoration: "none",
  },
}));

interface Props {
  number: number;
  label: string;
}
function UserNumberBox({ number, label }: Props) {
  const { classes } = useStyles();

  return (
    <Center className={classes.container}>
      <Stack>
        <Center className={classes.number}>{number}</Center>
        <Center className={classes.label}>{label}</Center>
      </Stack>
    </Center>
  );
}

export default UserNumberBox;
