import React from "react";
import { AppShell, Text, Navbar, Header } from "@mantine/core";
import AdminHeader from "./AdminHeader";
import AdminContent from "./AdminContent";
import { State } from "power-shared";
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
        <Navbar p="md" width={{ base: 300 }}>
          <Text>Application navbar</Text>
        </Navbar>
      }
      header={
        <Header height={120} p={0}>
          <AdminHeader />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <AdminContent /> <pre>{JSON.stringify(state)}</pre>
    </AppShell>
  );
}

export default Admin;
