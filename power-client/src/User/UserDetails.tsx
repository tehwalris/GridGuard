import { Accordion, ActionIcon, createStyles, Group } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import { State } from "power-shared";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  fullWidth: { width: "100%" },
  border: { border: "1px solid black" },
  warning: { backgroundColor: "#FFD8A8" },
}));

interface Props {
  state: State;
}

function UserContent({ state }: Props) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Accordion>
        <Accordion.Item value="customization">
          <Accordion.Control disabled>Dishwasher</Accordion.Control>
          <Accordion.Panel>
            Colors, fonts, shadows and many other parts are customizable to fit
            your design needs
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="flexibility">
          <Accordion.Control className={classes.warning}>
            <Group position="apart" className={classes.fullWidth}>
              Fridge{" "}
              <ActionIcon color="orange">
                <IconInfoCircle />
              </ActionIcon>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            Configure components appearance and behavior with vast amount of
            settings or overwrite any part of component styles
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="focus-ring">
          <Accordion.Control disabled>Oven</Accordion.Control>
          <Accordion.Panel>
            With new :focus-visible pseudo-class focus ring appears only when
            user navigates with keyboard
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default UserContent;
