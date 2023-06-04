import "next-auth";

//modify the existing next-auth library types
declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    username?: string;
  }
}
