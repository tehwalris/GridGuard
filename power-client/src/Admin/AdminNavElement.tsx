import { Center, createStyles, Group } from "@mantine/core";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    fontSize: 25,
    height: 100,
    color: theme.colors.primary1,
    letterSpacing: 2,
  },
  active: { width: 10, height: 100, backgroundColor: theme.colors.red[0] },
  nonactive: { width: 10, height: 100 },
}));

interface Props {
  to: string;
  label: string;
  active: boolean;
}

function AdminNavElement({ to, label, active }: Props) {
  const { classes } = useStyles();

  return (
    <Group className={classes.container}>
      <div className={active ? classes.active : classes.nonactive} />
      <Link to={to}>
        <Center p="lg">{label}</Center>
      </Link>
    </Group>
  );
}

export default AdminNavElement;
