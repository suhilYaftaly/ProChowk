import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  colorMode: "light" | "dark";
  isSessionExpired: boolean;
}

const initialState: SettingsState = {
  colorMode: "dark",
  isSessionExpired: false,
};

const slice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setColorMode(state, action: PayloadAction<SettingsState["colorMode"]>) {
      state.colorMode = action.payload;
    },
    setSessionExpired(
      state,
      action: PayloadAction<SettingsState["isSessionExpired"]>
    ) {
      state.isSessionExpired = action.payload;
    },
  },
});

export const { setColorMode, setSessionExpired } = slice.actions;
export default slice.reducer;
