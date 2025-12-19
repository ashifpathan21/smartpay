import { useState } from "react";
import { signin, type SIGN_IN_DATA } from "../api/services/userService";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { removeLoading, setLoading } from "../redux/slices/pageSlice";
import { Button } from "@/components/ui/button";
import Connect from "../assets/connect.webp";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
const Signup = () => {
  const [data, setData] = useState<SIGN_IN_DATA>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!data) {
      return;
    }
    dispatch(setLoading());
    e.preventDefault();
    await dispatch(signin(data, navigate, removeLoading));
  };
  return (
    <main className="min-h-screen w-screen flex max-w-screen my-10 overflow-x-hidden justify-center items-start   gap-10">
      <Card className=" hidden md:flex lg:flex w-5/12 border shadow-sm  ">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Connect with us </CardTitle>
          <CardDescription>Make your payments easy and safe</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={Connect} className="object-cover" />
        </CardContent>
        <CardFooter className="text-sm text-center flex justify-center items-center text-gray-500">
          <p>@smartpay-2026</p>
        </CardFooter>
      </Card>
      <Card className="p-4 w-full md:w-6/12 lg:w-6/12 border shodow-md  ">
        <CardHeader className="p-3 ">
          <CardTitle className="text-center text-2xl">Sign Up Now !!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-3 ">
            <section>
              <Label htmlFor="firstName">First Name :</Label>
              <Input
                id="firsName"
                className="w-full p-3 active:border-cyan-100 focus:border-cyan-200 "
                type="text"
                value={data.firstName}
                placeholder="Enter Your First Name"
                onChange={(e) =>
                  setData({ ...data, firstName: e.target.value })
                }
              />
            </section>
            <section>
              <Label htmlFor="lastName">Last Name :</Label>
              <Input
                type="text"
                value={data.lastName}
                className="w-full p-3 active:border-cyan-100 focus:border-cyan-200 "
                id="lastName"
                placeholder="Enter Your Last Name"
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
              />
            </section>
            <section>
              <Label htmlFor="username">Username :</Label>
              <Input
                type="text"
                className="w-full p-3 active:border-cyan-100 focus:border-cyan-200 "
                id="username"
                value={data.username}
                placeholder="Enter username of at least 3 and at most 10 letters"
                maxLength={10}
                minLength={3}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </section>
            <section>
              <Label htmlFor="password">Password :</Label>
              <Input
                id="password"
                value={data.password}
                className="w-full p-3 active:border-cyan-100 focus:border-cyan-200 "
                type="password"
                minLength={6}
                placeholder="Enter password with of at least 6 letters"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </section>
            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center flex-col items-center gap-3 ">
          <Button
            onClick={() => navigate("/login")}
            variant="link"
            size="lg"
            className="w-full text-slate-800"
          >
            Already Have an account ?
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Signup;
