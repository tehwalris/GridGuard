export const findTileSizes = (
  imageSize: { width: number; height: number },
  lowerTarget: number,
  upperTarget: number,
) => {
  const imageRatio = imageSize.height / imageSize.width;

  let row = 2;
  let col = 2;

  let bestRatio = Infinity;
  let bestSize = { width: 0, height: 0 };

  while (true) {
    if (row / col > imageRatio) {
      col += 2;
    } else {
      row += 2;
    }
    if (row * col > upperTarget) {
      break;
    }
    if (
      row * col >= lowerTarget &&
      Math.abs(row / col - imageRatio) < Math.abs(bestRatio - imageRatio)
    ) {
      bestRatio = row / col;
      bestSize = { width: col, height: row };
    }
  }

  return bestSize;
};
