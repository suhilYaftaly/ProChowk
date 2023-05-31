import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function App() {
  const { data } = useSession();

  return (
    <div>
      <button onClick={() => signIn("google")}>Sing In</button>
    </div>
  );
}
