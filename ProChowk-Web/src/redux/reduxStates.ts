import { useAppSelector } from "../utils/hooks";

export const useSettingsStates = () => {
  const { colorMode } = useAppSelector((state) => state.settings);
  return { colorMode };
};
export const useUserStates = () => {
  const { googleToken, googleTokenError, userProfile, userProfileError } =
    useAppSelector((state) => state.user);
  return { googleToken, googleTokenError, userProfile, userProfileError };
};
