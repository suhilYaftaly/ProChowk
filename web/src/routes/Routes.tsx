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
import VerifyEmail from "@pages/VerifyEmail";
import ResetPassword from "@pages/ResetPassword";

export const paths = {
  login: "/login",
  user: (nameId: string) => `/user/${nameId}`, //nameId = (suhilmohammad-647edfd209ee1be1232asd)
  jobView: (userId: string, jobId: string) => `/job-view/${userId}/${jobId}`,
  verifyEmail: `/verify-email`,
  resetPassword: `/reset-password`,
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.user(":nameId")} element={<User />} />
      <Route path={paths.jobView(":userId", ":jobId")} element={<JobView />} />
      <Route path={paths.verifyEmail} element={<VerifyEmail />} />
      <Route path={paths.resetPassword} element={<ResetPassword />} />
    </Route>
  )
);

export default function Routes() {
  return <RouterProvider router={router} />;
}
