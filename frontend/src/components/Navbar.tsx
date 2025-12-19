import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header>
      <nav className="w-full p-3 flex justify-around items-center ">
        <section
          onClick={() => navigate("/")}
          className="text-3xl font-bold text-blue-400"
        >
          <h1>
            Smart<span className="text-black">Pay</span>
          </h1>
        </section>

        <section className="flex justify-between items-center gap-5">
          <Button
            size="lg"
            type="button"
            className="font-semibold"
            onClick={() => navigate("/signup")}
            variant="default"
          >
            Sign Up
          </Button>
          <Button
            size="lg"
            type="button"
            className="font-semibold"
            onClick={() => navigate("/login")}
            variant="secondary"
          >
            Log In
          </Button>
        </section>
      </nav>
    </header>
  );
};

export default Navbar;
