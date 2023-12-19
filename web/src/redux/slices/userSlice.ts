import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { googleLogout } from "@react-oauth/google";
import { TOKENS_KEY, USER_PROFILE_KEY } from "@constants/localStorageKeys";
import { IUser } from "@gqlOps/user";
import { ILatLng } from "@gqlOps/address";
import { ITokens } from "@/types/commonTypes";
import { TUserView } from "@user/SwitchUserViewButton";

interface UserState {
  userProfile: {
    data: IUser | undefined;
    isLoading: boolean;
    error: { message: string; [key: string]: any } | undefined;
  };
  isLoggedOut: boolean | undefined;
  userLocation: {
    data: ILatLng | undefined;
    isLoading: boolean;
    error: { message: string; [key: string]: any } | undefined;
  };
  userView: TUserView | null;
}

const initialState: UserState = {
  userProfile: { data: undefined, isLoading: false, error: undefined },
  isLoggedOut: undefined,
  userLocation: { data: undefined, isLoading: false, error: undefined },
  userView: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userProfileBegin(state) {
      state.userProfile.isLoading = true;
    },
    userProfileSuccess(
      state,
      action: PayloadAction<UserState["userProfile"]["data"]>
    ) {
      state.userProfile.isLoading = false;
      state.userProfile.data = action.payload;
      state.userProfile.error = undefined;
    },
    userProfileError(state, action) {
      state.userProfile.isLoading = false;
      state.userProfile.data = undefined;
      state.userProfile.error = action.payload;
    },
    setUserProfileInfo(
      state,
      action: PayloadAction<UserState["userProfile"]["data"]>
    ) {
      state.userProfile.data = action.payload;
    },
    setIsLoggedOut(state, action: PayloadAction<UserState["isLoggedOut"]>) {
      state.isLoggedOut = action.payload;
    },
    userLocationBegin(state) {
      state.userLocation.isLoading = true;
    },
    userLocationSuccess(
      state,
      action: PayloadAction<UserState["userLocation"]["data"]>
    ) {
      state.userLocation.data = action.payload;
      state.userLocation.isLoading = false;
      state.userLocation.error = undefined;
    },
    userLocationError(state, action) {
      // state.userLocation.data = undefined;
      state.userLocation.isLoading = false;
      state.userLocation.error = action.payload;
    },
    setUserView(state, action: PayloadAction<UserState["userView"]>) {
      state.userView = action.payload;
    },
  },
});

export const {
  userProfileBegin,
  userProfileError,
  userLocationBegin,
  userLocationSuccess,
  userLocationError,
  setUserProfileInfo,
  setUserView,
} = slice.actions;
const { userProfileSuccess, setIsLoggedOut } = slice.actions;
export default slice.reducer;

export const logIn = (payload: IUser) => (dispatch: any) => {
  const { token, refreshToken, ...user } = payload;
  dispatch(userProfileSuccess(user));
  dispatch(setIsLoggedOut(false));
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));

  if (token && refreshToken)
    dispatch(setTokens({ accessToken: token, refreshToken }));
};
export const logOut = () => (dispatch: any) => {
  googleLogout();
  dispatch(userProfileSuccess(undefined));
  dispatch(setIsLoggedOut(true));
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem(TOKENS_KEY);
};
export const setUserProfile =
  (payload: IUser) => (dispatch: any, getState: any) => {
    const { token, refreshToken, ...pUser } = payload;
    const eUser: IUser | undefined = getState().user.userProfile.data;
    const user = { ...eUser, ...pUser };
    dispatch(setUserProfileInfo(user));
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
  };

export const setTokens =
  ({ accessToken, refreshToken }: ITokens) =>
  () => {
    //TODO: move to cookies
    localStorage.setItem(
      TOKENS_KEY,
      JSON.stringify({ accessToken, refreshToken } as ITokens)
    );
  };
