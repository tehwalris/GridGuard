import { Center, createStyles, Stack } from "@mantine/core";
import AdminCard from "./AdminCard";

const useStyles = createStyles(
  (theme, { labelColor }: { labelColor: string | undefined }, getRef) => ({
    container: { height: 100, width: "100%", fontSize: 30 },
    number: {
      fontSize: 30,
      color: labelColor || theme.colors.primary1[0],
      textDecoration: "none !important",
    },
    label: {
      fontSize: 12,
      color: theme.colors.contrast2[0],
      textDecoration: "none",
    },
  }),
);

interface Props {
  value: number | string;
  label: string;
  backgroundColor?: string;
  labelColor?: string;
}

function AdminNumberCard({ value, label, backgroundColor, labelColor }: Props) {
  const { classes } = useStyles({ labelColor });

  return (
    <AdminCard backgroundColor={backgroundColor}>
      <Center className={classes.container}>
        <Stack>
          <Center className={classes.number}>{value}</Center>
          <Center className={classes.label}>{label}</Center>
        </Stack>
      </Center>
    </AdminCard>
  );
}

export default AdminNumberCard;
