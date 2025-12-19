import { login, type LOG_IN_DATA } from "@/api/services/userService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { removeLoading, setLoading } from "@/redux/slices/pageSlice";
import type { AppDispatch } from "@/redux/store";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [data, setData] = useState<LOG_IN_DATA>({
    username: "",
    password: "",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!data) {
      return;
    }
    dispatch(setLoading());
    e.preventDefault();
    await dispatch(login(data, navigate, removeLoading));
  };
  return (
    <main className="w-screen min-h-screen p-3 ">
      <Card className="max-w-175 mx-auto w-full my-10 ">
        <CardHeader className="flex items-center justify-center text-3xl">
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4 ">
            <section>
              <Label htmlFor="username">Username :</Label>
              <Input
                id="username"
                placeholder="Enter Your Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </section>
            <section>
              <Label htmlFor="password">Password :</Label>
              <Input
                id="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Enter Your Password"
              />
            </section>
            <Button className="w-full" size={"lg"} variant="default">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            onClick={() => navigate("/signup")}
            className="w-full "
            size={"lg"}
            variant={"link"}
          >
            New with us ?
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Login;
