import { configureStore } from "@reduxjs/toolkit";
import settings from "./slices/settingsSlice";
import user from "./slices/userSlice";
import configs from "./slices/configsSlice";
import globalModals from "./slices/globalModalsSlice";
import bid from "./slices/bidSlice";
import conversation from "./slices/conversationSlice";

export const store = configureStore({
  reducer: { settings, user, configs, globalModals, bid, conversation },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
