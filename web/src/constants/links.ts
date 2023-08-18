import { paths } from "@/routes/Routes";

const env = import.meta.env;

export const userLink = (nameId: string) =>
  env.VITE_BASE_URL + paths.user(nameId); //nameId = (suhilmohammad-647edfd209ee1be1232asd)
export const jobLink = (userId: string, jobId: string) =>
  env.VITE_BASE_URL + paths.jobView(userId, jobId);
