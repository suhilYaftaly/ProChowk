import { useAppSelector } from "../utils/hooks/hooks";

export const useSettingsStates = () =>
  useAppSelector((state) => state.settings);

export const useUserStates = () => {
  const userStates = useAppSelector((state) => state.user);
  const user = userStates?.userProfile?.data;
  return { ...userStates, user };
};

export const useConfigsStates = () => useAppSelector((state) => state.configs);

export const useGlobalModalsStates = () =>
  useAppSelector((state) => state.globalModals);
