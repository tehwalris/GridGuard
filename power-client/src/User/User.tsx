import { AppShell, Header } from "@mantine/core";
import { State } from "power-shared";
import UserContent from "./UserContent";
import UserHeader from "./UserHeader";

interface Props {
  state: State;
  userId: string;
}

function User({ state, userId }: Props) {
  return (
    <AppShell
      padding={0}
      header={
        <Header withBorder={false} height={80}>
          <UserHeader />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      <UserContent state={state} userId={userId} />
    </AppShell>
  );
}

export default User;
