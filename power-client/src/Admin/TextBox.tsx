import { Center, createStyles } from "@mantine/core";
import AdminCard from "./AdminCard";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: 100, width: "100%", fontSize: 30 },
}));

interface Props {
  content: string;
}

function AdminBox({ content }: Props) {
  const { classes } = useStyles();

  return (
    <AdminCard>
      <Center className={classes.container}>{content}</Center>
    </AdminCard>
  );
}

export default AdminBox;
