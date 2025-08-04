import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: new HttpLink({
      uri: process.env.GRAPHQL_ENDPOINT,
    }),
  });
});
