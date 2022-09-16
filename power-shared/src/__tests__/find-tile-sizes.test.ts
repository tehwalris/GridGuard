import { findTileSizes } from "../find-tile-sizes";

describe("findTileSizes", () => {
  test("square image", () => {
    expect(findTileSizes({ height: 500, width: 500 }, 30, 40)).toEqual({
      height: 6,
      width: 6,
    });
  });
  test("basic 840x480", () => {
    expect(findTileSizes({ height: 480, width: 840 }, 80, 120)).toEqual({
      height: 8,
      width: 14,
    });
  });
  test("basic 1920x1080", () => {
    expect(findTileSizes({ height: 1080, width: 1920 }, 80, 120)).toEqual({
      height: 8,
      width: 14,
    });
  });
  test("basic 1920x1080", () => {
    for (let i = 0; i < 10; i++) {
      const output = findTileSizes(
        {
          height: Math.random() * 1000,
          width: Math.random() * 1000,
        },
        60,
        80,
      );
      expect(output.height % 2).toEqual(0);
      expect(output.width % 2).toEqual(0);
    }
  });
});
