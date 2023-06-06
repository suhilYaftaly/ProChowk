import { useAppSelector } from "../utils/hooks/hooks";

export const useSettingsStates = () => {
  const { colorMode } = useAppSelector((state) => state.settings);
  return { colorMode };
};
export const useUserStates = () => {
  const { userProfile, isLoggedOut, userLocation } = useAppSelector(
    (state) => state.user
  );
  const user = userProfile?.data;
  return { userProfile, user, isLoggedOut, userLocation };
};
