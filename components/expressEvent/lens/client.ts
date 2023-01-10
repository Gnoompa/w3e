import {
  ApolloClient,
  ApolloLink,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
  toPromise,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import axios from "axios";

// const API_URL = "https://api.lens.dev/";
const API_URL = "https://api-sandbox-mumbai.lens.dev";

const parseJwt = (
  token: string
): {
  exp: number;
} => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error(error);
    return { exp: 0 };
  }
};

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const clearStorage = () => {
  localStorage.removeItem("lensAccessToken");
  localStorage.removeItem("lensRefreshToken");
};

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: "no-cors",
  fetch,
});

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  delay: {
    initial: 100,
  },
  attempts: {
    max: 2,
    retryIf: (error) => Boolean(error),
  },
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem("lensAccessToken");

  if (!accessToken || accessToken === "undefined") {
    clearStorage();
    return forward(operation);
  }

  const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!expiringSoon) {
    operation.setContext({
      headers: {
        "x-access-token": accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    return forward(operation);
  }

  return fromPromise(
    axios(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        operationName: "Refresh",
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: {
          request: { refreshToken: localStorage.getItem("lensRefreshToken") },
        },
      }),
    })
      .then(({ data }) => {
        const accessToken = data?.data?.refresh?.accessToken;
        const refreshToken = data?.data?.refresh?.refreshToken;
        operation.setContext({
          headers: {
            "x-access-token": `Bearer ${accessToken}`,
          },
        });

        localStorage.setItem("lensAccessToken", accessToken);
        localStorage.setItem("lensRefreshToken", refreshToken);

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
});

export const client = new ApolloClient({
  link: from([retryLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
