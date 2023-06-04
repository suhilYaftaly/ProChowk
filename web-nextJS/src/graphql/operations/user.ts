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
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  // Subscriptions: {}
};

//interfaces
export interface ICreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}
export interface ICreateUsernameVariables {
  username: string;
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
