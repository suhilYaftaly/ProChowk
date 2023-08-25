import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { store } from "@redux/store";
import { logOut, setUserProfile } from "@rSlices/userSlice";
import { paths } from "@routes/Routes";
import { navigate } from "@routes/navigationService";
import userOps, { IRefreshTokenData, IRefreshTokenInput } from "@gqlOps/user";
import { decodeJwtToken } from "@/utils/utilFuncs";

const { dispatch } = store;

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let token = store.getState().user.userProfile.data?.token;

    const setTokenAndForward = async () => {
      if (token) {
        const decodedToken = decodeJwtToken(token);
        const currentTime = Date.now().valueOf() / 1000;

        if (decodedToken.exp < currentTime) {
          try {
            // Attempt to refresh the token
            const userData = store.getState().user.userProfile.data;
            const refreshToken = userData?.refreshToken;

            if (refreshToken && userData) {
              const newAccessToken = await fetchNewToken(refreshToken);

              if (newAccessToken) {
                const { accessToken, refreshToken } = newAccessToken;
                // Update Redux store with new token
                dispatch(
                  setUserProfile({ ...userData, refreshToken }, accessToken)
                );
                token = accessToken;
              }
            }
          } catch (error) {
            console.error("Token refresh failed:", error);
          }
        }
      }

      // Add the token to the operation's context so it can be included in the HTTP headers
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      }));

      // Forward the operation down the chain
      forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    };

    setTokenAndForward().catch(observer.error.bind(observer));
  });
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        dispatch(logOut());
        navigate(paths.login);
      }
    }
  }

  // To retry on network errors, you can use the RetryLink instead of handling it here.
  // This example just logs the network error.
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

/**
 * REFRESH TOKEN HELPERS
 */
const tokenLink = ApolloLink.from([errorLink, httpLink]);
const tokenClient = new ApolloClient({
  link: tokenLink,
  cache: new InMemoryCache(),
});

async function fetchNewToken(refreshToken: string) {
  try {
    const { data } = await tokenClient.mutate<
      IRefreshTokenData,
      IRefreshTokenInput
    >({
      mutation: userOps.Mutations.validateRefreshToken,
      variables: { refreshToken },
    });
    if (data && data.validateRefreshToken) return data.validateRefreshToken;
    else throw new Error("Failed to refresh token");
  } catch (error: any) {
    console.error(error);
  }
}
