import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";
interface SettingsState {
  colorMode: ThemeMode;
}

const initialState: SettingsState = {
  colorMode: "light",
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
  },
});

export const { setColorMode } = slice.actions;
export default slice.reducer;
