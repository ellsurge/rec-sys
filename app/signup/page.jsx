"use client";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import React, { useState } from "react";
import { signUp } from "../actions";
import { Button } from "@nextui-org/button";

export default function Signup() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);

  const action = async () => {
    setloading(true);
    if (user != "" && password != "") {
      // console.log(user, password);
      const payload = {
        user,
        password,
      };
      setloading(true);
      await signUp(payload).then((e) => {
        setError(e);
        setloading(false);
      });
    }
  };
  // console.log(user)
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            SignUP{" "}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <p className=" text-center text-sm font-italic leading-9 tracking-tight text-danger">
              {error}
            </p>
          )}
          <div className="space-y-6">
            <div>
              <label
                for="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User Name{" "}
              </label>
              <div className="mt-2">
                <Input
                  onValueChange={(e) => setUser(e)}
                  id="text"
                  name="user name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <Input
                  onValueChange={(e) => setPassword(e)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <Button
                isLoading={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={action}
              >
                Sign in
              </Button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
