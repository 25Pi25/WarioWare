export type MicrogameLength = "short" | "medium" | "long" | "infinity";
export type WinState = "win" | "lose";

export interface MicrogameSettings {
  length: MicrogameLength
  startCondition: WinState | null
}