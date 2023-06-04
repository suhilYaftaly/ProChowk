"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import userOps, {
  ICreateUsernameData,
  ICreateUsernameVariables,
} from "@/graphqlOps/user";

export default function MyProfile() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [createUsername, { data, loading, error }] = useMutation<
    ICreateUsernameData,
    ICreateUsernameVariables
  >(userOps.Mutations.createUsername);

  console.log("USER SESSION: ", session?.user);

  const reloadSession = () => {
    document.dispatchEvent(new Event("visibilitychange"));
  };

  const onSave = async () => {
    if (!username) return;
    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) throw new Error();
      const error = data?.createUsername?.error;
      if (error) throw new Error(error);

      //reload session to get new session
      reloadSession();
    } catch (error) {
      console.log("onSave error", error);
    }
  };

  return (
    <div>
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
      <div>
        <button onClick={() => onSave()}>Save</button>
      </div>
    </div>
  );
}
