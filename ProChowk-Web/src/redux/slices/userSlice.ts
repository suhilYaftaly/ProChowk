import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  googleToken:
    | {
        access_token: string;
        token_type: "Bearer" | string;
        expires_in: number;
        scope: string;
        prompt: string;
        authuser: string;
        [key: string]: any;
      }
    | any;
  googleTokenError: any;
  userProfile:
    | {
        id: string;
        email: string;
        verified_email: string;
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
        locale: string;
      }
    | undefined;
  userProfileError: any;
}

const initialState: UserState = {
  googleToken: undefined,
  googleTokenError: undefined,
  userProfile: undefined,
  userProfileError: undefined,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGoogleToken(state, action: PayloadAction<UserState["googleToken"]>) {
      state.googleToken = action.payload;
    },
    setGoogleTokenError(
      state,
      action: PayloadAction<UserState["googleTokenError"]>
    ) {
      state.googleTokenError = action.payload;
    },
    setUserProfile(state, action: PayloadAction<UserState["userProfile"]>) {
      state.userProfile = action.payload;
    },
    setUserProfileError(
      state,
      action: PayloadAction<UserState["userProfileError"]>
    ) {
      state.userProfileError = action.payload;
    },
  },
});

export const {
  setGoogleToken,
  setGoogleTokenError,
  setUserProfile,
  setUserProfileError,
} = slice.actions;
export default slice.reducer;
