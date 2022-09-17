import { Box, Center, createStyles, Stack } from "@mantine/core";

const useStyles = createStyles((theme, params, getRef) => ({
  container: { height: 90 },
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
        <Box>{number}</Box>
        <Box>{label}</Box>
      </Stack>
    </Center>
  );
}

export default UserNumberBox;
