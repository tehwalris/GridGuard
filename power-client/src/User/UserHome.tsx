import { Box, Center, createStyles, Group, Stack, Text } from "@mantine/core";
import {
  selectRecentLoad,
  selectUserDeviceSimulationStates,
  State,
} from "power-shared";
import { Link } from "react-router-dom";
import { colors } from "../colors";
import LineChart from "../components/LineChart";
import UserCard from "../User/UserCard";
import UserNumberBox from "./UserNumberBox";

const useStyles = createStyles(
  (theme, { color }: { color: string }, getRef) => ({
    container: {
      width: "100%",
      margin: 20,
      marginLeft: 40,
    },
    border: { border: "1px solid black" },
    imminent: {
      width: "100%",
      color,
      fontWeight: 800,
      letterSpacing: 2,
    },
    title: {
      fontSize: 20,
      color: theme.colors.primary1,
      letterSpacing: 2,
      fontWeight: 800,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.contrast2,
      fontWeight: 400,
      letterSpacing: "normal",
    },
    leftBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: 20,
      background: "white",
      boxShadow: "0px 0px 5px " + theme.colors.contrast2[0],
    },
  }),
);

interface Props {
  state: State;
  userId: string;
}

function UserContent({ state, userId }: Props) {
  const recentLoad = selectRecentLoad(state);
  const lastLoad = selectRecentLoad(state).slice(-1)[0];
  const lastLoadBad = lastLoad > 1.01 || lastLoad < 0.99;

  const { classes } = useStyles({
    color: lastLoadBad ? colors.red![0] : colors.primary1![0],
  });

  const affectedDeviceCount = selectUserDeviceSimulationStates(
    state,
    userId,
  ).filter((s) => s.deviceAffected).length;

  return (
    <Box className={classes.container}>
      <div className={classes.leftBorder} />
      <Text className={classes.title}>HELLO, USER</Text>
      <Text className={classes.subtitle} pb="sm">
        This is an overview of the current grid situation
      </Text>
      <Stack spacing={20}>
        <UserCard>
          <LineChart data={recentLoad} title="NETWORK LOAD" simple={true} />
        </UserCard>
        <UserCard backgroundColor={lastLoadBad ? colors.lightRed![0] : "white"}>
          <Center className={classes.imminent}>
            <Stack p={0} spacing="xs">
              {lastLoadBad ? "OUTAGE IMMINENT!" : "GRID STATUS NORMAL"}
              <Text size={12} className={classes.subtitle}>
                {lastLoadBad
                  ? "Your devices may be turned off!"
                  : "Your devices are not affected!"}
              </Text>
            </Stack>
          </Center>
        </UserCard>
        <Group position="apart">
          <UserCard>
            <UserNumberBox number={1} label="Power Saved" />
          </UserCard>
          <UserCard>
            <Link to="/user/details">
              <UserNumberBox
                number={affectedDeviceCount}
                label="Devices affected"
              />
            </Link>
          </UserCard>
        </Group>
      </Stack>
    </Box>
  );
}

export default UserContent;
