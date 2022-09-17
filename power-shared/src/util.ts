export function unreachable(v: never): never {
  console.warn("unreachable called with", v);
  throw new Error("unreachable");
}

export function sleep(millis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), millis));
}
