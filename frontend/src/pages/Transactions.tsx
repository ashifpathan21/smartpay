import { getTranscations } from "@/api/services/accountService";
import { Button } from "@/components/ui/button";
import type { User } from "@/redux/slices/userSlice";
import type { Store } from "@/redux/store";
import { ArrowUpIcon, StepBack } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export interface Transaction {
  amount: number;
  createdAt: Date;
  from: User;
  mode: "TRANSFER" | "RECEIVED";
  tag: string;
  to: User;
  _id: string;
}
const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const friend: User = location.state?.friend;
  const params = useParams();
  const { id } = params;
  const { token } = useSelector((state: Store) => state.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const getTransaction = async () => {
    const res = await getTranscations(token, id);
    setTransactions(res.data);
  };

  useEffect(() => {
    getTransaction();
  }, []);

  return (
    <main>
      <section className="p-3 flex justify-between items-center ">
        <Button
          onClick={() => navigate(-1)}
          variant={"destructive"}
          size={"icon"}
        >
          <StepBack />
        </Button>
        {friend && friend.firstName && (
          <h2 className="capitalize text-2xl font-mono w-full text-center font-semibold" >{`${friend.firstName} ${friend.lastName}`}</h2>
        )}
      </section>
      {transactions?.length > 0 ? (
        <section className="p-4 flex flex-col gap-3 justify-start">
          {transactions?.map((transaction) => (
            <section
              key={transaction._id}
              className="flex rounded-lg border border-slate-500 p-2 px-4 gap-2 items-center justify-between"
            >
              <section className="flex gap-3 items-center p-1 ">
                <div className="flex flex-col text-sm items-center gap-2 ">
                  <ArrowUpIcon
                    className={`${
                      transaction.mode === "RECEIVED" ? "rotate-180 text-green-400 " : "text-red-400 "
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1 ">
                  <h2 className="font-semibold font-mono">
                    {transaction?.tag}
                  </h2>
                  <p className="text-sm capitalize font-semibold ">
                    {transaction?.mode === "TRANSFER"
                      ? `${transaction.to.firstName}  ${transaction.to.lastName}`
                      : `${transaction.from.firstName} ${transaction.from.lastName}`}
                  </p>
                  <p className="text-sm text-slate-700">
                    {transaction?.mode === "TRANSFER"
                      ? `@${transaction.to.username}`
                      : `@${transaction.from.username}`}
                  </p>
                  <p className="text-sm text-slate-500">
                    {transaction?.createdAt?.toLocaleString()}
                  </p>
                </div>
              </section>
              <div className="text-lg font-bold font-sans">{`RS. ${transaction.amount}`}</div>
            </section>
          ))}
        </section>
      ) : (
        <section className="flex h-screen w-screen justify-center items-center font-semibold text-2xl">
          <h1>No Transactions History</h1>
        </section>
      )}
    </main>
  );
};
export default Transactions;
