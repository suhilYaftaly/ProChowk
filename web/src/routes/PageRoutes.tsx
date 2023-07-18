import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import Home from "@pages/Home";
import Login from "@pages/Login";
import User from "@pages/User";
import JobView from "@pages/JobView";

export const paths = {
  login: "/login",
  user: (nameId: string) => `/user/${nameId}`, //nameId = (suhilmohammad-647edfd209ee1be1232asd)
  jobView: (nameId: string, jobId: string) => `/job-view/${nameId}/${jobId}`, //nameId = (suhilmohammad-647edfd209ee1be1232asd)
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.user(":nameId")} element={<User />} />
      <Route path={paths.jobView(":nameId", ":jobId")} element={<JobView />} />
    </Route>
  )
);

export default function PageRoutes() {
  return <RouterProvider router={router} />;
}
