import assert from "assert";
import { times } from "ramda";

const LOBBY_CODE_LENGTH = 6;

export function lobbyCodeFromUrl(url: string) {
  const m = url.match(/^\/lobbies\/([a-z0-9]+)$/);
  if (!m) {
    throw new Error("invalid URL for lobby");
  }
  const lobbyCode = m[1];
  assert(isLobbyCodeValid(lobbyCode));
  return lobbyCode;
}

export function isLobbyCodeValid(code: string) {
  return !!code.match(/^[a-z0-9]+$/) && code.length === LOBBY_CODE_LENGTH;
}

export function randomLobbyCode(): string {
  const lettersAndNumbers: string[] = [];
  for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
    lettersAndNumbers.push(String.fromCharCode(i));
  }
  for (let i = 0; i <= 9; i++) {
    lettersAndNumbers.push("" + i);
  }

  return times(
    () =>
      lettersAndNumbers[Math.floor(Math.random() * lettersAndNumbers.length)],
    6,
  ).join("");
}
