import { useAppSelector } from "../utils/hooks";

export const useSettingsStates = () => {
  const { colorMode } = useAppSelector((state) => state.settings);
  return { colorMode };
};
export const useUserStates = () => {
  const { googleToken, userProfile } = useAppSelector((state) => state.user);
  return { googleToken, userProfile };
};
