import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonCom from "../../shared/ButtonCom";
import InputCom from "../../shared/InputCom";
import InputPassword from "../../shared/InputPassword";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { errorObj, userObj } from "../../utils/staticObj";
import validate from "../../utils/validate";
import "./css/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(userObj);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorObj);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (error[name]) {
      const errors = validate(name, value);
      setError({ ...error, [name]: errors });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    Object.entries(user).forEach(([key, value]) => {
      errors[key] = validate(key, value);
    });
    setError(errors);
    if (Object.values(errors).every((val) => !val)) {
      try {
        setLoading(true);
        const response = await postRequest("users/Login", { data: user });
        if (response.statusCode === 200) {
          document.cookie = `authToken=${response?.data?.token}; path=/; max-age=${60 * 60}; secure`;
          document.cookie = `authUser=${JSON.stringify(response?.data)};path=/; max-age=${60 * 60}; secure`;
          toast.success(response.message);
          navigate("/dashboard");
        } else {
          toast.info(response.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="authContainer">
      {loading && <Loader />}
      <div className="authInnerDiv">
        <form onSubmit={handleSubmit} className="form">
          <h1 className="authHeading">Login </h1>
          <label htmlFor="email">Email:</label>
          <span className="error">{error.email}</span> <br />
          <InputCom
            type="text"
            value={user.email}
            onChange={(e) => handleChange(e)}
            id="email"
            name="email"
          />
          <br />
          <label htmlFor="password">Password:</label>
          <span className="error">{error.password}</span> <br />
          <InputPassword
            value={user.password}
            onChange={(e) => handleChange(e)}
            id="password"
            name="password"
          />
          <br />
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <ButtonCom text="Login" type="submit">
              Login
            </ButtonCom>
          </div>
          <p>
            <Link to="/forgetPassword" style={{ textDecoration: "underline" }}>
              Forget password
            </Link>
          </p>
          <br />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <p>Don't have an account?</p>
            <Link to="/signup" style={{ textDecoration: "underline" }}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
