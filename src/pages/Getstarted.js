import { useNavigate } from "react-router-dom";
import chef from "../assets/chef.png";
const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="gs-container">
      
      {/* LEFT SIDE */}
      <div className="gs-left">
        <h1>
          Welcome to <span>Malabaani Restaurant</span>
        </h1>

        <p>
          Discover delicious food delivered to your door! 🍕🍔
        </p>

        <button onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="gs-right">
        <img
          className="chef-img"
          src={chef}
          alt="chef"
        />

      </div>

    </div>
  );
};

export default GetStarted;