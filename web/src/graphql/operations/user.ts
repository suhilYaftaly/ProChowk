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
    loginUser: gql`
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          id
          name
          email
          emailVerified
          createdAt
          updatedAt
          image
          token
        }
      }
    `,
  },
  // Subscriptions: {}
};

//interfaces
export interface ILoginUserInput {
  email: string;
  password: string;
}
export interface ILoginUserData {
  loginUser: {
    id: string;
    name: string;
    email: string;
    emailVerified: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    token: string;
  };
}

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
