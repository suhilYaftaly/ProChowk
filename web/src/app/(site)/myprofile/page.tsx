"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function MyProfile() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");

  const onSave = async () => {
    try {
      //createUsername mutation
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
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}
