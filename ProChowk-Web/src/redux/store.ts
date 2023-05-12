import { configureStore } from "@reduxjs/toolkit";
import settings from "./slices/settingsSlice";
import user from "./slices/userSlice";

export const store = configureStore({
  reducer: { settings, user },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
