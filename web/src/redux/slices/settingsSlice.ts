import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  colorMode: "light" | "dark";
}

const initialState: SettingsState = {
  colorMode: "dark",
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
