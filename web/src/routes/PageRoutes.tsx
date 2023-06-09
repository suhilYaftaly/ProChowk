import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import MyProfile from "@/pages/MyProfile";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

export const paths = {
  login: "/login",
  myprofile: "/myprofile",
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.myprofile} element={<MyProfile />} />
    </Route>
  )
);

export default function PageRoutes() {
  return <RouterProvider router={router} />;
}
