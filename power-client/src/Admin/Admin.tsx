import React from "react";
import { AppShell, Text, Navbar, Header } from "@mantine/core";
import LineChart from "../components/LineChart";

function Admin() {
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
    </AppShell>
  );
}

export default Admin;
