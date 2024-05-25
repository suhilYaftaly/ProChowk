import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOKENS_KEY, USER_PROFILE } from '@constants/localStorageKeys';
import { IUser } from '@gqlOps/user';
import { ILatLng } from '@gqlOps/address';
import { ITokens } from '@/types/commonTypes';
import { deleteFromLocalStorage, saveInLocalStorage } from '~/src/utils/secureStore';
import { googleLogout } from '~/src/utils/utilFuncs';
import { INearbyContFilters } from '~/src/components/user/drawer/ContrFilterDrawer';
import { TUserView } from '~/src/components/user/drawer/SwitchUserViewBtn';
import { removeDataFromAsyncStore, saveDataInAsyncStore } from '~/src/utils/asyncStorage';
import { INearByJobFilters } from '~/src/components/user/contractor/ContractorHome';
/* import { TUserView } from "@user/SwitchUserViewButton";
 */
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
  contFilters: INearbyContFilters | null;
  projectFilters: INearByJobFilters | null;
}

const initialState: UserState = {
  userProfile: { data: undefined, isLoading: false, error: undefined },
  isLoggedOut: undefined,
  userLocation: { data: undefined, isLoading: false, error: undefined },
  userView: null,
  contFilters: null,
  projectFilters: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userProfileBegin(state) {
      state.userProfile.isLoading = true;
    },
    userProfileSuccess(state, action: PayloadAction<UserState['userProfile']['data']>) {
      state.userProfile.isLoading = false;
      state.userProfile.data = action.payload;
      state.userProfile.error = undefined;
    },
    userProfileError(state, action) {
      state.userProfile.isLoading = false;
      state.userProfile.data = undefined;
      state.userProfile.error = action.payload;
    },
    setUserProfileInfo(state, action: PayloadAction<UserState['userProfile']['data']>) {
      state.userProfile.data = action.payload;
    },
    setIsLoggedOut(state, action: PayloadAction<UserState['isLoggedOut']>) {
      state.isLoggedOut = action.payload;
    },
    userLocationBegin(state) {
      state.userLocation.isLoading = true;
    },
    userLocationSuccess(state, action: PayloadAction<UserState['userLocation']['data']>) {
      state.userLocation.data = action.payload;
      state.userLocation.isLoading = false;
      state.userLocation.error = undefined;
    },
    userLocationError(state, action) {
      // state.userLocation.data = undefined;
      state.userLocation.isLoading = false;
      state.userLocation.error = action.payload;
    },
    setUserView(state, action: PayloadAction<UserState['userView']>) {
      state.userView = action.payload;
    },
    setContFilters(state, action: PayloadAction<UserState['contFilters']>) {
      state.contFilters = action.payload;
    },
    setProjectsFilters(state, action: PayloadAction<UserState['projectFilters']>) {
      state.projectFilters = action.payload;
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
  setContFilters,
  setProjectsFilters,
} = slice.actions;
const { userProfileSuccess, setIsLoggedOut } = slice.actions;
export default slice.reducer;

export const logIn = (payload: IUser) => (dispatch: any) => {
  const { token, refreshToken, ...user } = payload;
  dispatch(userProfileSuccess(user));
  dispatch(setIsLoggedOut(false));
  saveDataInAsyncStore(USER_PROFILE, user);

  if (token && refreshToken) dispatch(setTokens({ accessToken: token, refreshToken }));
};
export const logOut = () => (dispatch: any) => {
  googleLogout();
  dispatch(userProfileSuccess(undefined));
  dispatch(setIsLoggedOut(true));
  removeDataFromAsyncStore(USER_PROFILE);
  deleteFromLocalStorage(TOKENS_KEY);
};
export const setUserProfile = (pUser: IUser) => (dispatch: any, getState: any) => {
  const eUser: IUser | undefined = getState().user.userProfile.data;
  const user = eUser ? { ...eUser, ...pUser } : pUser;
  dispatch(setUserProfileInfo(user));
  saveDataInAsyncStore(USER_PROFILE, user);
};

export const setTokens =
  ({ accessToken, refreshToken }: ITokens) =>
  () => {
    saveInLocalStorage(TOKENS_KEY, JSON.stringify({ accessToken, refreshToken } as ITokens));
  };
