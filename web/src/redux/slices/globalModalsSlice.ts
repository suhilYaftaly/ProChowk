import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  openJobPost: boolean;
}

const initialState: IState = {
  openJobPost: false,
};

const slice = createSlice({
  name: "globalModals",
  initialState,
  reducers: {
    setOpenJobPost(state, action: PayloadAction<IState["openJobPost"]>) {
      state.openJobPost = action.payload;
    },
  },
});

export const { setOpenJobPost } = slice.actions;
export default slice.reducer;
