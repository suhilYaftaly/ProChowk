import { Outlet } from "react-router-dom";

import AppHeader from "../components/headerSection/AppHeader";

export default function RootLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
