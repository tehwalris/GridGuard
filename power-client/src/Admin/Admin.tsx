import { AppShell, Header, Navbar, Text } from "@mantine/core";
import { State } from "power-shared";
import LineChart from "../components/LineChart";
import { RunAction } from "../useUnilog";

interface Props {
  state: State;
  runAction: RunAction;
}

function Admin({ state }: Props) {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar p="md" width={{ sm: 200, lg: 300 }}>
          <Text>Application navbar</Text>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Text>Header</Text>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <LineChart />
      <pre>{JSON.stringify(state)}</pre>
    </AppShell>
  );
}

export default Admin;
