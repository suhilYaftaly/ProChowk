import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { store } from "@redux/store";
import { logOut } from "@rSlices/userSlice";
import { setSessionExpired } from "@rSlices/settingsSlice";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = store.getState().user.userProfile.data?.token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "x-operation-name": "something",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === "UNAUTHENTICATED") {
          // // Modify the operation context with a new token
          // const oldHeaders = operation.getContext().headers;
          // operation.setContext({
          //   headers: {
          //     ...oldHeaders,
          //     authorization: getNewToken(), // Replace this with the function to get a new token
          //   },
          // });
          // // Retry the request, returning the new observable
          // return forward(operation);
          console.log("TODO: Implement token refresh");
          console.log("Operation", operation);
          console.log("Forward", forward);
          store.dispatch(logOut());
          store.dispatch(setSessionExpired(true));
        }
      }
    }

    // To retry on network errors, you can use the RetryLink instead of handling it here.
    // This example just logs the network error.
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

const link = ApolloLink.from([authLink, errorLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
