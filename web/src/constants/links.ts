import { paths } from "@/routes/Routes";

const env = import.meta.env;

export const userLink = (nameId: string) =>
  env.VITE_BASE_URL + paths.user(nameId); //nameId = (suhilmohammad-647edfd209ee1be1232asd)

export const userLocationLearnMoreLink =
  "https://support.google.com/maps/answer/2839911?hl=en&authuser=0&visit_id=638354975761927041-2915837&co=GENIE.Platform%3DDesktop&oco=&p=browser_lp&rd=1#permission";
