import { ApolloClient, InMemoryCache } from "@apollo/client";

const API_URI = "https://api.stg.cyberconnect.dev/";

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

export const client = clientFactory(API_URI);
