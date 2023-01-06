import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcxNzk4NjkyNzksImVtYWlsIjoiZ25vb21wYUBnbWFpbC5jb20iLCJ0d2l0dGVySUQiOiJAV2ViM0V2ZW50c19haSIsIm5hbWVzcGFjZSI6IkxpbmszIiwib3JpZ2luX2hvc3QiOiJ3ZWIzZXZlbnRzLmFpIiwiaXNzIjoiQ3liZXJDb25uZWN0IiwiZXhwIjoxNjc1MzQ4OTA1LCJpYXQiOjE2NzI3NTY5MDV9.bapx_Um0ORdxVb4njX0PqCOOn6yjz7EXMq5kM43smkA";
const API_URI = "https://api.stg.cyberconnect.dev/";

const httpLink = new HttpLink({
  uri: API_URI,
  fetchOptions: "no-cors",
  fetch,
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem("cyberConnectAccessToken");

  operation.setContext({
    headers: {
      "X-API-KEY": API_KEY,
    },
  });

  accessToken &&
    operation.setContext({
      headers: {
        Authorization: accessToken ? `bearer ${accessToken}` : "",
      },
    });

  return forward(operation);
});

export const clientFactory = (uri: string) =>
  new ApolloClient({
    link: from([httpLink, authLink]),
    cache: new InMemoryCache(),
  });

export const client = clientFactory(API_URI);
