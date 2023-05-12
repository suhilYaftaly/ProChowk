import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  googleToken: {
    data:
      | {
          access_token?: string;
          token_type?: "Bearer" | string;
          expires_in?: number;
          scope?: string;
          prompt?: string;
          authuser?: string;
          credential?: string;
          clientId?: string;
          [key: string]: any;
        }
      | undefined;
    isLoading: boolean;
    error: any;
  };
  userProfile: {
    data:
      | {
          id: string;
          email: string;
          name: string;
          given_name: string;
          family_name: string;
          picture: string;
          [key: string]: any;
        }
      | undefined;
    isLoading: boolean;
    error: any;
  };
}

const initialState: UserState = {
  googleToken: { data: undefined, isLoading: false, error: undefined },
  userProfile: { data: undefined, isLoading: false, error: undefined },
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    googleTokenSuccess(
      state,
      action: PayloadAction<UserState["googleToken"]["data"]>
    ) {
      state.googleToken.data = action.payload;
      state.googleToken.isLoading = false;
      state.googleToken.error = undefined;
    },
    googleTokenError(state, action) {
      state.googleToken.data = undefined;
      state.googleToken.isLoading = false;
      state.googleToken.error = action.payload;
    },
    userProfileBegin(state) {
      state.userProfile.isLoading = true;
    },
    userProfileSuccess(
      state,
      action: PayloadAction<UserState["userProfile"]["data"]>
    ) {
      state.userProfile.data = action.payload;
      state.userProfile.isLoading = false;
      state.userProfile.error = undefined;
    },
    userProfileError(state, action) {
      state.userProfile.data = undefined;
      state.userProfile.isLoading = false;
      state.userProfile.error = action.payload;
    },
  },
});

export const {
  googleTokenSuccess,
  googleTokenError,
  userProfileBegin,
  userProfileSuccess,
  userProfileError,
} = slice.actions;
export default slice.reducer;
