import { AppShell, Header, Navbar } from "@mantine/core";
import { State } from "power-shared";
import { RunAction } from "../useUnilog";
import AdminContent from "./AdminContent";
import AdminHeader from "./AdminHeader";
import AdminNav from "./AdminNav";

interface Props {
  state: State;
  runAction: RunAction;
}

function Admin({ state, runAction }: Props) {
  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar withBorder={false} width={{ base: 300 }}>
          <AdminNav />
        </Navbar>
      }
      header={
        <Header withBorder={false} height={120} p={0}>
          <AdminHeader />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <AdminContent state={state} runAction={runAction} />
    </AppShell>
  );
}

export default Admin;
