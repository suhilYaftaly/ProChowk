import { useAppSelector } from "../utils/hooks/hooks";

export const useSettingsStates = () =>
  useAppSelector((state) => state.settings);

export const useUserStates = () => {
  const userStates = useAppSelector((state) => state.user);
  const user = userStates?.userProfile?.data;
  const firstName = user?.name?.split(" ")?.[0];
  const userId = user?.id;
  return { ...userStates, user, firstName, userId };
};

export const useConfigsStates = () => useAppSelector((state) => state.configs);

export const useGlobalModalsStates = () =>
  useAppSelector((state) => state.globalModals);

export const useBidStates = () => useAppSelector((state) => state.bid);
export const useConversationStates = () =>
  useAppSelector((state) => state.conversation);
