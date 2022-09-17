import { AppShell, Header } from "@mantine/core";
import { State } from "power-shared";
import UserContent from "./UserContent";
import UserHeader from "./UserHeader";

interface Props {
  state: State;
}

function User({ state }: Props) {
  return (
    <AppShell
      padding={0}
      header={
        <Header height={80}>
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
