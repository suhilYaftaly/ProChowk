import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigsState {
  showHiredModal: boolean;
}

const initialState: ConfigsState = {
  showHiredModal: false,
};

const slice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    setShowHiredModal(
      state,
      action: PayloadAction<ConfigsState["showHiredModal"]>
    ) {
      state.showHiredModal = action.payload;
    },
  },
});

export const { setShowHiredModal } = slice.actions;
export default slice.reducer;
