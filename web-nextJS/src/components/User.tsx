"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLazyQuery } from "@apollo/client";

import userOps, { ISearchUserInput, ISearchUsersData } from "@/graphqlOps/user";

export default function User() {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    ISearchUsersData,
    ISearchUserInput
  >(userOps.Queries.searchUsers);

  const onSearch = () => searchUsers({ variables: { username } });
  console.log("SEARCHED USER", data);

  const handleSignOut = async () => {
    await signOut({
      redirect: false, // Disable automatic redirect
      callbackUrl: "/login", // Provide the correct callback URL
    }).then(() => {
      router.push("/login"); // Redirect after signOut is completed
    });
  };

  return (
    <>
      <div>{JSON.stringify(session)}</div>
      <div>
        <label>Username</label>
        <input
          id="username"
          name="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div style={{ margin: 25 }}>
        <button onClick={onSearch}>Search User</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </>
  );
}
