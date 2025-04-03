import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonCom from "../../shared/ButtonCom";
import DropDown from "../../shared/DropDown";
import InputCom from "../../shared/InputCom";
import InputPassword from "../../shared/InputPassword";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { dropObj, fields, signUpUserObj } from "../../utils/staticObj";
import validate from "../../utils/validate";
import "./css/auth.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(signUpUserObj);
  const [error, setError] = useState(signUpUserObj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value.trim() });
    if (error[name]) {
      const errors = validate(name, value);
      setError({ ...error, [name]: errors });
    }
  };

  const validation = () => {
    let errors = {};
    Object.entries(user).forEach(([key, value]) => {
      errors[key] = validate(key, value);
    });
    setError(errors);
    return Object.values(errors).every((val) => !val);
  };

  const addUser = async () => {
    try {
      setLoading(true);
      console.log(user);
      let response = await postRequest("users/SignUp", { data: user });
      if (response.statusCode === 200) {
        toast.success(response?.message);
        toast.success("Please verify your email");
        setUser(signUpUserObj);
        navigate("/login");
      } else {
        toast.error(response?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validation() && addUser();
  };

  return (
    <div className="authContainer">
      {loading && <Loader />}
      <div className="authInnerDiv">
        <form onSubmit={handleSubmit} className="form">
          <h1 className="authHeading">SignUp </h1>
          {fields.map((val) => (
            <Fragment key={val.id}>
              <label htmlFor={val.id}>{val.name}</label>
              <span className="error">{error[val.id]}</span>
              {val.input === "input" ? (
                <InputCom
                  type={val.type}
                  id={val.id}
                  value={user[val.id]}
                  name={val.id}
                  onChange={handleChange}
                  placeholder={val.placeholder}
                />
              ) : val.input === "password" ? (
                <InputPassword
                  id={val.id}
                  value={user[val.id]}
                  name={val.id}
                  onChange={handleChange}
                  placeholder={val.placeholder}
                />
              ) : (
                <DropDown
                  value={user[val.id]}
                  id={val.id}
                  name={val.id}
                  onChange={handleChange}
                  dropObj={dropObj}
                />
              )}
              <br />
            </Fragment>
          ))}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <ButtonCom type="submit">Sign Up</ButtonCom>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <p>Already have an account?</p>
            <Link
              to="/login"
              style={{ textDecoration: "underline" }}
              state={{ padding: "0px" }}
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
