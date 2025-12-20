import { transferMoney } from "@/api/services/accountService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { removeLoading, setLoading } from "@/redux/slices/pageSlice";
import type { User } from "@/redux/slices/userSlice";
import type { AppDispatch, Store } from "@/redux/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Pay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: Store) => state.user);
  const { isLoading } = useSelector((state: Store) => state.page);
  const [amount, setAmount] = useState<number>(0);
  const [tag, setTag] = useState("");
  const location = useLocation();
  const friend: User = location.state.friend;
  if (!friend) {
    toast.error("Something Went Wrong");
    navigate("/");
  }

  const payToFriend = async () => {
     dispatch(setLoading());
    await dispatch(
      transferMoney(
        token,
        {
          to: friend._id,
          amount: amount ?? 0,
          tag,
        },
        removeLoading,
        navigate
      )
    );
  };
  return (
    <main className="flex justify-center p-4 items-center w-screen h-screen">
      <section className="max-w-175 flex flex-col gap-3 rounded-xl shadow-sm  ">
        <h2 className="text-2xl text-center">{`Paying to ${friend.firstName} ${friend.lastName}`}</h2>
        <p className="tex-lg font-mono text-center">{friend.username}</p>

        <Input
          placeholder="100"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Input
          placeholder="Enter a Tag"
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <Button disabled={isLoading} onClick={payToFriend}>
          Pay
        </Button>
      </section>
    </main>
  );
};

export default Pay;
