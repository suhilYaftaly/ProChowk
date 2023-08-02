import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  colorMode: "light" | "dark";
  isSessionExpired: boolean;
  globalError?: string;
}

const initialState: SettingsState = {
  colorMode: "dark",
  isSessionExpired: false,
  globalError: undefined,
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
    setSessionExpired(state, action: SettingsAction<"isSessionExpired">) {
      state.isSessionExpired = action.payload;
    },
    setGlobalError(state, action: SettingsAction<"globalError">) {
      state.globalError = action.payload;
    },
  },
});

export const { setColorMode, setSessionExpired, setGlobalError } =
  slice.actions;
export default slice.reducer;
