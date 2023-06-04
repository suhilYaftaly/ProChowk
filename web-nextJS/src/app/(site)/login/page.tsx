"use client";

import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //redirect to home page after successful login
  useEffect(() => {
    if (sessionStatus === "authenticated") router.push(".");
  }, [sessionStatus]);

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const signInUser = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("credentials", { ...formData, redirect: false })
      .then(() => alert("User has been logged in"))
      .catch(() => alert("Something went wrong"));
  };

  return (
    <div>
      <div>
        <label>Email</label>
        <input
          id="email"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleFDataChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          id="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleFDataChange}
        />
      </div>
      <div>
        <button onClick={signInUser}>Sign In</button>
      </div>
      <div>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    </div>
  );
}
