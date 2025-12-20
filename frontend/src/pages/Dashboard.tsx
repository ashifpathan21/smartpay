import { createAccount, getBalance } from "@/api/services/accountService";
import { findUser, getProfile } from "@/api/services/userService";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/useDebounce";
import type { User } from "@/redux/slices/userSlice";
import type { AppDispatch, Store } from "@/redux/store";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, token } = useSelector((state: Store) => state.user);
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [balance, setBalance] = useState();
  const [users, setUsers] = useState<User[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(query, 500);

  const fetchBalance = async () => {
    setLoading(true);
    const res = await getBalance(token);
    setBalance(res);
    setShowBalance(true);
    setLoading(false);
  };

  const createAc = async () => {
    await createAccount(token);
    await dispatch(getProfile(token, navigate));
  };

  const getUsers = async (query: String) => {
    const res = await findUser(query, token);
    setUsers(res);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      getUsers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <main>
      <section className="p-4 px-8  my-6 flex flex-col gap-3">
        <h1 className=" text-xl animate-in font-mono ">
          Welcome {user?.username} !
        </h1>
        <h2 className="font-sans capitalize text-2xl font-semibold">
          Hello {user?.firstName} {user?.lastName}
        </h2>
        {user?.account ? (
          <section className="flex flex-col gap-3">
            <section className="flex flex-col md:flex-row lg:flex-row justify-between items-center p-3 text-lg  ">
              <p>
                Account Detail :
                {"X".repeat(user?.account.length - 4) +
                  user?.account.slice(user.account.length - 4)}
              </p>
              <section className="flex items-center gap-4 ">
                <Button onClick={() => navigate("/transactions/")}>
                  View Transcations
                </Button>
                {!showBalance ? (
                  <Button disabled={loading} onClick={fetchBalance} className="" variant="outline">
                    Check Balance
                  </Button>
                ) : (
                  <Button onClick={() => setShowBalance(false)}>
                    <X />
                    Hide
                  </Button>
                )}
              </section>
            </section>
            {showBalance && balance && (
              <section className="flex gap-3 items-center justify-between px-6 ">
                <h3 className="font-semibold text-slate-600 ">
                  Your Current Balance is Rs. {balance}{" "}
                </h3>
              </section>
            )}
          </section>
        ) : (
          <section className="flex justify-between items-center p-3 text-lg  ">
            <p>You don't have an account yet:</p>
            <Button onClick={createAc} className="" variant="outline">
              Create Account
            </Button>
          </section>
        )}
      </section>
      {user?.account && (
        <section className="w-full p-3 px-8">
          <InputGroup>
            <InputGroupInput
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder="Search for Users"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          {users?.length > 0 && (
            <section className="flex flex-col gap-3 py-4 ">
              {users.map((friend) => (
                <section
                  className="flex justify-between items-center px-4 p-2 gap-4 rounded-lg shadow-sm shadow-slate-600  "
                  key={friend._id}
                >
                  <section>
                    <h2 className=" font-sans capitalize font-semibold">
                      {friend.firstName} {friend.lastName}
                    </h2>
                    <p className="text-sm text-gray-600 ">@{friend.username}</p>
                  </section>
                  <section className="flex items-center gap-3 ">
                    <Button
                      variant={"link"}
                      onClick={() =>
                        navigate(`/transactions/${friend._id}`, {
                          state: { friend },
                        })
                      }
                    >
                      Transcations
                    </Button>

                    <Button
                      variant="outline"
                      size={"lg"}
                      onClick={() =>
                        navigate(`/pay/${friend._id}`, { state: { friend } })
                      }
                    >
                      Pay
                    </Button>
                  </section>
                </section>
              ))}
            </section>
          )}
        </section>
      )}
    </main>
  );
};

export default Dashboard;
