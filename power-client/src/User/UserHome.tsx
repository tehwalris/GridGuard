import { Box, Center, createStyles, Group, Stack, Text } from "@mantine/core";
import { selectRecentLoad, State } from "power-shared";
import { Link } from "react-router-dom";
import LineChart from "../components/LineChart";
import UserCard from "../User/UserCard";
import UserNumberBox from "./UserNumberBox";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
    margin: 10,
    marginLeft: 20,
  },
  border: { border: "1px solid black" },
  imminent: { width: "100%", height: 20 },
  title: {
    fontSize: 20,
    color: theme.colors.primary1,
    letterSpacing: 2,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.contrast2,
    marginBottom: 10,
  },
  leftBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: 10,
    background: "white",
  },
}));

interface Props {
  state: State;
  userId: string;
}

function UserContent({ state, userId }: Props) {
  const { classes } = useStyles();

  const recentLoad = selectRecentLoad(state);

  return (
    <Box className={classes.container}>
      <div className={classes.leftBorder} />
      <Text className={classes.title}>HELLO, USER</Text>
      <Text className={classes.subtitle}>
        This is an overview of the current grid situation
      </Text>
      <Stack spacing={15}>
        <UserCard>
          <LineChart data={recentLoad} title="Network Load" />
        </UserCard>
        <UserCard>
          <Center className={classes.imminent}>OUTAGE IMMINENT!</Center>
        </UserCard>
        <Group position="apart" grow>
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
