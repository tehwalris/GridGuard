import { Box, Label, TextField, SelectList } from "gestalt";
import React, { useEffect, useRef, useState } from "react";
import { ImageWithSize } from "puzzle-shared";

type ChangeHandler = (image: ImageWithSize) => void;

interface Props {
  imageUrl: string;
  onValidSelect: ChangeHandler;
}

export const ImageSelect = ({
  imageUrl: externalImageUrl,
  onValidSelect: onChange,
}: Props) => {
  const [internalImageUrl, setInternalImageUrl] = useState(externalImageUrl);
  useEffect(() => setInternalImageUrl(externalImageUrl), [externalImageUrl]);

  const latestOnChangeRef = useRef<ChangeHandler>();
  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    let isLatestRequest = true;

    setErrorMessage(undefined);

    const image = new Image();
    image.addEventListener("load", () => {
      if (!isLatestRequest) {
        return;
      }
      latestOnChangeRef.current?.({
        url: internalImageUrl,
        width: image.width,
        height: image.height,
      });
    });
    image.addEventListener("error", (error) => {
      console.warn("failed to load image", error);
      setErrorMessage("Failed to load image");
    });
    image.src = internalImageUrl;

    return () => {
      isLatestRequest = false;
    };
  }, [internalImageUrl]);

  const changeImageSelection = ({
    value,
  }: {
    event: React.SyntheticEvent<HTMLElement>;
    value: string;
  }) => {
    setInternalImageUrl(value);
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"start"} alignItems="end">
        <Box width={280}>
          <Box marginBottom={1}>
            <Label htmlFor="imageSelect">Select Image</Label>
          </Box>
          <SelectList
            id="imageSelect"
            onChange={changeImageSelection}
            options={[
              {
                label: "Indoor-Szene",
                value: "https://i.imgur.com/PuoRzgD.jpg",
              },
              {
                label: "Nozze di Cana",
                value:
                  "https://upload.wikimedia.org/wikipedia/commons/e/e0/Paolo_Veronese_008.jpg",
              },
              {
                label: "Zurich",
                value: "https://i.imgur.com/JiugGhF.png",
              },
              {
                label: "Ballroom Dancing",
                value:
                  "https://puzzlepalace.com.au/wp-content/uploads/2019/04/Keep-on-Dancing-1000-Piece-Jigsaw-Puzzle-Gibsons-2.jpg",
              },
            ]}
            size="md"
          />
          <Box marginBottom={1}>
            <Label htmlFor="imageUrl">or enter URL</Label>
          </Box>
          <TextField
            id={"imageURL"}
            onChange={({ value }) => setInternalImageUrl(value)}
            placeholder="https://example.com/yourImage.jpg"
            type="url"
            value={internalImageUrl}
            errorMessage={errorMessage}
          />
        </Box>
        <Box marginStart={2} height={40} display={"flex"} alignItems={"center"}>
          {!errorMessage ? (
            <img alt="preview" src={internalImageUrl} height={30} />
          ) : undefined}
        </Box>
      </Box>
    </>
  );
};
