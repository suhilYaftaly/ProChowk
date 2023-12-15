import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { isPast } from "date-fns";

import { store } from "@redux/store";
import { logOut, setTokens } from "@rSlices/userSlice";
import { paths } from "@routes/Routes";
import { navigate } from "@routes/navigationService";
import userOps, { IRefreshTokenData, IRefreshTokenInput } from "@gqlOps/user";
import { decodeJwtToken } from "@/utils/utilFuncs";
import { getLocalTokens } from "@/utils/auth";

const { dispatch } = store;

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: "include",
});

let isRefreshingToken = false;
let tokenRefreshPromise: Promise<string> | undefined = undefined;

const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const attemptTokenRefresh = async () => {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        tokenRefreshPromise = new Promise<string>(async (resolve, reject) => {
          try {
            const tokens = getLocalTokens();
            const oldRefreshToken = tokens?.refreshToken;
            if (oldRefreshToken) {
              const newToken = await fetchNewToken(oldRefreshToken);
              if (newToken) {
                const { accessToken, refreshToken } = newToken;
                // Update Redux store with new token
                dispatch(setTokens({ accessToken, refreshToken }));
                resolve(accessToken); // Resolve with new access token
              } else {
                reject(new Error("Token refresh failed"));
              }
            } else {
              reject(new Error("No refresh token available"));
            }
          } catch (error) {
            reject(error);
          } finally {
            isRefreshingToken = false;
          }
        });
      }

      return tokenRefreshPromise;
    };

    const setTokenAndForward = async () => {
      const tokens = getLocalTokens();
      let token = tokens?.accessToken;
      if (token) {
        const decodedToken = decodeJwtToken(token);

        if (isPast(new Date(decodedToken.exp * 1000))) {
          try {
            token = await attemptTokenRefresh();
          } catch (error) {
            console.error("Token refresh failed:", error);
          }
        }
      }

      // Set headers and forward operation
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      }));

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

//REFRESH TOKEN HELPERS
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
