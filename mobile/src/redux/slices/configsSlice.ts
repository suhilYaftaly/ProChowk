import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigsState {
  gKey: string;
}

const initialState: ConfigsState = {
  gKey: "",
};

const slice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    setGoogleMapKey(state, action: PayloadAction<ConfigsState["gKey"]>) {
      state.gKey = action.payload;
    },
  },
});

export const { setGoogleMapKey } = slice.actions;
export default slice.reducer;
