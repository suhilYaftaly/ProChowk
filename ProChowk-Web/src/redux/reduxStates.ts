import { useAppSelector } from "../utils/hooks";

export const useSettingsStates = () => {
  const { colorMode } = useAppSelector((state) => state.settings);
  return { colorMode };
};
export const useUserStates = () => {
  const { googleToken, userProfile, isLoggedOut, userLocation } =
    useAppSelector((state) => state.user);
  const user = userProfile?.data;
  return { googleToken, userProfile, user, isLoggedOut, userLocation };
};
