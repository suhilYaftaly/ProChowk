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
import Logs from "@pages/Logs";
import SignUp from "@pages/SignUp";
import ProfileSetup from "@pages/ProfileSetup";
import JobPost from "@/pages/JobPost";
import UserJobTypes, { JobType } from "@/pages/UserJobTypes";
import { UserType } from "@gqlOps/user";
import NotificationsView from "@/pages/NotificationsView";
import ConversationsView from "@/pages/conversationsView";
import ConversationView from "@/pages/conversationView";

export const paths = {
  login: "/login",
  signUp: "/sign-up",
  profileSetup: (userType?: UserType) =>
    `/profile-setup${userType ? `?userType=${userType}` : ""}`,
  user: (nameId: string) => `/user/${nameId}`, //nameId = (suhilmohammad-647edfd209ee1be1232asd)
  jobView: (jobId: string) => `/job-view/${jobId}`,
  verifyEmail: `/verify-email`,
  resetPassword: `/reset-password`,
  logs: `/logs`,
  jobPost: (jobId?: string) => `/job-post${jobId ? `?jobId=${jobId}` : ""}`,
  userJobTypes: (jobType?: JobType) =>
    `/user-job-type${jobType ? `?jobType=${jobType}` : ""}`,
  notificationsView: "/notifications-view",
  conversationsView: "/conversation-view",
  conversationView: (conversationId: string) =>
    `/conversation-view/${conversationId}`,
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path={paths.login} element={<Login />} />
      <Route path={paths.signUp} element={<SignUp />} />
      <Route path={paths.profileSetup()} element={<ProfileSetup />} />
      <Route path={paths.user(":nameId")} element={<User />} />
      <Route path={paths.jobView(":jobId")} element={<JobView />} />
      <Route path={paths.verifyEmail} element={<VerifyEmail />} />
      <Route path={paths.resetPassword} element={<ResetPassword />} />
      <Route path={paths.logs} element={<Logs />} />
      <Route path={paths.jobPost()} element={<JobPost />} />
      <Route path={paths.userJobTypes()} element={<UserJobTypes />} />
      <Route path={paths.notificationsView} element={<NotificationsView />} />
      <Route path={paths.conversationsView} element={<ConversationsView />} />
      <Route
        path={paths.conversationView(":conversationId")}
        element={<ConversationView />}
      />
    </Route>
  )
);

export default function Routes() {
  return <RouterProvider router={router} />;
}
