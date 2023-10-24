import { configureStore } from "@reduxjs/toolkit";
import settings from "./slices/settingsSlice";
import user from "./slices/userSlice";
import configs from "./slices/configsSlice";
import globalModals from "./slices/globalModalsSlice";

export const store = configureStore({
  reducer: { settings, user, configs, globalModals },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
