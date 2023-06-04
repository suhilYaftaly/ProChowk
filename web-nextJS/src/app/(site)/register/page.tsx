"use client";

import React, { ChangeEvent, MouseEvent, useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const registerUser = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios
      .post("/api/register", formData)
      .then(() => alert("user registered"))
      .catch(() => alert("an error occured"));
  };

  return (
    <div>
      <div>
        <label>Name</label>
        <input
          id="name"
          name="name"
          placeholder="name"
          value={formData.name}
          onChange={handleFDataChange}
        />
      </div>
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
        <button onClick={registerUser}>Register User</button>
      </div>
    </div>
  );
}
