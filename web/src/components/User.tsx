"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function User() {
  const { data: session } = useSession();
  const router = useRouter();

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
      <div style={{ margin: 25 }}>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </>
  );
}
