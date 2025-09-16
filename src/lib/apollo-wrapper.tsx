"use client";

import { GRAPHQL_ENDPOINT } from "@/shared/constants";
import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloClient, ApolloNextAppProvider, InMemoryCache, SSRMultipartLink } from "@apollo/client-integration-nextjs";
import { setContext } from "@apollo/client/link/context";

function makeClient() {
    const httpLink = new HttpLink({
        uri: GRAPHQL_ENDPOINT,
    });

    const authLink = setContext((_, { headers }) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("jwt_token");
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : "",
                },
            };
        }
        return { headers };
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true,
                      }),
                      httpLink,
                  ])
                : authLink.concat(httpLink),
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
