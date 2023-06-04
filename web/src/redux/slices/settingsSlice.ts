import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  colorMode: "light" | "dark";
}

const initialState: SettingsState = {
  colorMode: "light",
};

const slice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setColorMode(state, action: PayloadAction<SettingsState["colorMode"]>) {
      state.colorMode = action.payload;
    },
  },
});

export const { setColorMode } = slice.actions;
export default slice.reducer;
