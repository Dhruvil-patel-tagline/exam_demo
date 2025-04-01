import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonCom from "../../shared/ButtonCom";
import InputPassword from "../../shared/InputPassword";
import Loader from "../../shared/Loader";
import { getRequest, postRequest } from "../../utils/api";
import validate from "../../utils/validate";
import "./css/auth.css";

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  let token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  
  const user = {
    Password: data.password,
    ConfirmPassword: data.confirmPassword,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response = await getRequest("users/newPassword", token);
        if (response.statusCode !== 200) {
          toast.error("Password reset link is expired");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await postRequest(
        `users/ForgotPassword/Verify?token=${token}`,
        { data: user },
      );
      if (response?.statusCode === 200) {
        toast.success(response?.message);
        setTimeout(()=>{
          window.open('/login',"_blank");
          window.close();
        },5000)
        setData({ password: "", confirmPassword: "" });
      } else {
        toast.error(response?.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = {};
    Object.entries(data).forEach(([key, value]) => {
      error[key] = validate(key, value);
    });
    setErrors(error);
    if (data.password !== data.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "password is not matching",
      }));
    } else {
      Object.values(error).every((val) => !val) && fetchData();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (errors[name]) {
      let error = {};
      if (name === "confirmPassword") {
        error = validate(name, value, data.password);
      } else {
        error = validate(name, value);
      }
      setErrors({ ...errors, [name]: error });
    }
  };

  return (
    <div className="authContainer">
      {loading && <Loader />}
      <div className="authInnerDiv">
        <form
          onSubmit={handleSubmit}
          className="form"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h1 className="authHeading">Reset password</h1>
          <div>
            <div>
              <label name="password">Password</label>
              <span className="error">{errors.password}</span>
            </div>
            <InputPassword
              placeholder="New password..."
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <div>
              <label id="confirmPassword">Confirm password</label>
              <span className="error">{errors.confirmPassword}</span>
            </div>
            <InputPassword
              placeholder="Confirm password..."
              name="confirmPassword"
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <ButtonCom type="submit">Submit</ButtonCom>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewPassword;
