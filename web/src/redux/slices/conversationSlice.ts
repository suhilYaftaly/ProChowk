import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversationState {
  unreadConsCount: number | undefined;
}

const initialState: ConversationState = {
  unreadConsCount: 0,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUnreadConsCount(
      state,
      action: PayloadAction<ConversationState["unreadConsCount"]>
    ) {
      state.unreadConsCount = action.payload;
    },
  },
});

export const { setUnreadConsCount } = slice.actions;
export default slice.reducer;
