"use client";

import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { client } from "../graphql/apollo-client";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>{children}</SessionProvider>
    </ApolloProvider>
  );
}
