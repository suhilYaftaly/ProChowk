import { useAppSelector } from "../utils/hooks/hooks";

export const useSettingsStates = () => {
  const { colorMode, isSessionExpired, globalError } = useAppSelector(
    (state) => state.settings
  );
  return { colorMode, isSessionExpired, globalError };
};

export const useUserStates = () => {
  const { userProfile, isLoggedOut, userLocation } = useAppSelector(
    (state) => state.user
  );
  const user = userProfile?.data;
  return { userProfile, user, isLoggedOut, userLocation };
};

export const useConfigsStates = () => {
  const { gKey } = useAppSelector((state) => state.configs);
  return { gKey };
};
