import { Box, Center, createStyles, Group, Stack } from "@mantine/core";
import { State } from "power-shared";
import { Link } from "react-router-dom";
import LineChart from "../components/LineChart";
import UserCard from "../User/UserCard";
import UserNumberBox from "./UserNumberBox";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  border: { border: "1px solid black" },
  imminent: { width: "100%", height: 20 },
}));

interface Props {
  state: State;
}

function UserContent({ state }: Props) {
  const { classes } = useStyles();
  const recentPowerConsumption = state.simulationHistory.map(
    (h) => h.powerConsumption,
  );
  return (
    <Box className={classes.container}>
      <Stack spacing={15}>
        <UserCard>
          <LineChart data={recentPowerConsumption} title="Network Load" />
        </UserCard>
        <UserCard>
          <Center className={classes.imminent}>OUTAGE IMMINENT!</Center>
        </UserCard>
        <Group position="center" grow>
          <UserCard>
            <UserNumberBox number={1} label="Power Saved" />
          </UserCard>
          <UserCard>
            <Link to="/user/details">
              <UserNumberBox number={2} label="Devices affected" />
            </Link>
          </UserCard>
        </Group>
      </Stack>
    </Box>
  );
}

export default UserContent;
