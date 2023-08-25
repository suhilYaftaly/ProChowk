import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { googleLogout } from "@react-oauth/google";
import { USER_PROFILE_KEY } from "@constants/localStorageKeys";
import { IUser } from "@gqlOps/user";
import { ILatLng } from "@gqlOps/address";

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
}

const initialState: UserState = {
  userProfile: { data: undefined, isLoading: false, error: undefined },
  isLoggedOut: undefined,
  userLocation: { data: undefined, isLoading: false, error: undefined },
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
  },
});

export const {
  userProfileBegin,
  userProfileError,
  userLocationBegin,
  userLocationSuccess,
  userLocationError,
  setUserProfileInfo,
} = slice.actions;
const { userProfileSuccess, setIsLoggedOut } = slice.actions;
export default slice.reducer;

export const logIn = (payload: IUser) => (dispatch: any) => {
  dispatch(userProfileSuccess(payload));
  dispatch(setIsLoggedOut(false));
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(payload));
};
export const logOut = () => (dispatch: any) => {
  googleLogout();
  dispatch(userProfileSuccess(undefined));
  dispatch(setIsLoggedOut(true));
  localStorage.removeItem(USER_PROFILE_KEY);
};
export const setUserProfile =
  (payload: IUser, tokenToUse = "") =>
  (dispatch: any, getState: any) => {
    const token = tokenToUse || getState().user.userProfile.data?.token;
    const eUser = getState().user.userProfile.data;
    const pData = eUser
      ? { ...eUser, ...payload, token }
      : { ...payload, token };
    dispatch(setUserProfileInfo(pData));
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(pData));
  };
