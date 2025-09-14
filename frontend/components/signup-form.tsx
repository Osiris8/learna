"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const handleSignupForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = document.querySelector(
      ".emailError"
    ) as HTMLElement | null;

    axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signup`,
      withCredentials: true,
      data: {
        firstname,
        lastname,
        email,
        password,
      },
    })
      .then(() => {
        window.location.href = "/login";
      })
      .catch((err) => {
        if (emailError) {
          emailError.innerHTML = "Email or password incorrect";
        }
        console.log(err);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignupForm}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="firstname">Firstname</Label>
                  <Input
                    id="firstame"
                    type="text"
                    placeholder="John"
                    onChange={(e) => setFirstname(e.target.value)}
                    value={firstname}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastname">Lastname</Label>
                  <Input
                    id="lastname"
                    type="lastname"
                    placeholder="Doe"
                    onChange={(e) => setLastname(e.target.value)}
                    value={lastname}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <span className="text-red-500 emailError"></span>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Do you have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
