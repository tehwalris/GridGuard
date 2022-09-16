import { Box, Heading, Label, RadioButton, Switch } from "gestalt";
import React from "react";
import {
  ActionType,
  DistributionTime,
  GameSettings,
  numberOfPiecesBounds,
  distributionTimes,
  NumberOfTiles,
} from "puzzle-shared";
import { RunAction } from "../useUnilog";
import { ImageSelect } from "./ImageSelect";

interface Props {
  settings: GameSettings;
  runAction: RunAction;
}

const PreGameSettings: React.FC<Props> = ({ settings, runAction }) => {
  return (
    <Box>
      <Heading accessibilityLevel={2} size="md">
        Settings
      </Heading>
      <Box width="450px" paddingY={2}>
        <ImageSelect
          imageUrl={settings.image.url}
          onValidSelect={(image) =>
            runAction((userId) => ({
              type: ActionType.ChangeSettings,
              userId,
              settings: { image },
            }))
          }
        />
      </Box>
      <Box
        display="flex"
        direction="row"
        justifyContent="between"
        width="450px"
        paddingY={2}
      >
        <Box display="flex" direction="column">
          <Box marginBottom={1}>
            <Label htmlFor="tiles">Number of tiles</Label>
          </Box>
          {[NumberOfTiles.Few, NumberOfTiles.Medium, NumberOfTiles.Many].map(
            (numberOfTiles) => (
              <Box key={numberOfTiles} paddingY={1}>
                <RadioButton
                  checked={settings.roughNumberOfTiles === numberOfTiles}
                  id={`numberOfTiles-${numberOfTiles}`}
                  label={numberOfTiles}
                  value={numberOfTiles}
                  name="tiles"
                  onChange={() =>
                    runAction((userId) => ({
                      type: ActionType.ChangeSettings,
                      userId,
                      settings: { roughNumberOfTiles: numberOfTiles },
                    }))
                  }
                  subtext={`${Math.floor(
                    numberOfPiecesBounds[numberOfTiles].low / 4,
                  )}-${Math.ceil(
                    numberOfPiecesBounds[numberOfTiles].high / 4,
                  )} tiles per person`}
                />
              </Box>
            ),
          )}
        </Box>

        <Box display="flex" direction="column">
          <Box marginBottom={1}>
            <Label htmlFor="tiles">Distribution time</Label>
          </Box>
          {[
            DistributionTime.Short,
            DistributionTime.Medium,
            DistributionTime.Long,
          ].map((distributionTime) => (
            <Box key={distributionTime} paddingY={1}>
              <RadioButton
                checked={settings.distributionTime === distributionTime}
                id={`distributionTime-${distributionTime}`}
                label={distributionTime}
                value={distributionTime}
                name="time"
                onChange={() =>
                  runAction((userId) => ({
                    type: ActionType.ChangeSettings,
                    userId,
                    settings: { distributionTime },
                  }))
                }
                subtext={`At least ${distributionTimes[distributionTime].low}s per tile`}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box width="450px" paddingY={2}>
        <Box marginBottom={1}>
          <Label htmlFor="preview">Show Image Preview</Label>
        </Box>
        <Switch
          onChange={() =>
            runAction((userId) => ({
              type: ActionType.ChangeSettings,
              userId,
              settings: {
                ...settings,
                enableImagePreview: !settings.enableImagePreview,
              },
            }))
          }
          id="preview"
          switched={settings.enableImagePreview}
        />
      </Box>
    </Box>
  );
};

export default PreGameSettings;
