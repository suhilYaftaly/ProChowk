import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";
interface SettingsState {
  colorMode: ThemeMode;
  isAppLoaded: boolean;
}

const initialState: SettingsState = {
  colorMode: "light",
  isAppLoaded: false,
};

type SettingsAction<T extends keyof SettingsState> = PayloadAction<
  SettingsState[T]
>;

const slice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setColorMode(state, action: SettingsAction<"colorMode">) {
      state.colorMode = action.payload;
    },
    setAppLoaded(state, action: SettingsAction<"isAppLoaded">) {
      state.isAppLoaded = action.payload;
    },
  },
});

export const { setColorMode, setAppLoaded } = slice.actions;
export default slice.reducer;
