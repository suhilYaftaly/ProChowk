import { gql } from "@apollo/client";

export default {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
        }
      }
    `,
  },
  Mutations: {
    registerUser: gql`
      mutation RegisterUser(
        $name: String!
        $email: String!
        $password: String!
      ) {
        registerUser(name: $name, email: $email, password: $password) {
          id
          name
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          token
          provider
          roles
        }
      }
    `,
    loginUser: gql`
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          id
          name
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          token
          provider
          roles
        }
      }
    `,
    googleLogin: gql`
      mutation GoogleLogin($accessToken: String!) {
        googleLogin(accessToken: $accessToken) {
          id
          name
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          token
          provider
          roles
        }
      }
    `,
    googleOneTapLogin: gql`
      mutation GoogleOneTapLogin($credential: String!) {
        googleOneTapLogin(credential: $credential) {
          id
          name
          email
          emailVerified
          createdAt
          updatedAt
          image {
            picture
          }
          token
          provider
          roles
        }
      }
    `,
  },
  // Subscriptions: {}
};

//interfaces
export interface IRegisterUserInput {
  name: string;
  email: string;
  password: string;
}
export interface IRegisterUserData {
  registerUser: IUserData;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}
export interface ILoginUserData {
  loginUser: IUserData;
}

export interface IGoogleLoginInput {
  accessToken: string;
}
export interface IGoogleLoginData {
  googleLogin: IUserData;
}

export interface IGoogleOneTapLoginInput {
  credential: string;
}
export interface IGoogleOneTapLoginData {
  googleOneTapLogin: IUserData;
}

export interface IUserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image: { picture: string; size?: number; [key: string]: any };
  token: string;
  provider: string;
  roles?: UserRole[];
}
type UserRole = "admin" | "superAdmin";

export interface ISearchUserInput {
  username: string;
}
export interface ISearchUsersData {
  searchUsers: Array<ISearchUser>;
}
export interface ISearchUser {
  id: string;
  username: string;
}
