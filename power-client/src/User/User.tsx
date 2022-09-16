import React from "react";
import { AppShell, Header } from "@mantine/core";
import { State } from "power-shared";
import UserHeader from "./UserHeader";
import UserContent from "./UserContent";
import { Outlet } from "react-router-dom";

interface Props {
  state: State;
}

function User({ state }: Props) {
  console.log(JSON.stringify(state));
  return (
    <AppShell
      padding="md"
      header={
        <Header height={80} p="md">
          <UserHeader />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <UserContent state={state} />
    </AppShell>
  );
}

export default User;
