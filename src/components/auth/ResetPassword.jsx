import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cancel from "../../assets/cancel.png";
import ButtonCom from "../../shared/ButtonCom";
import InputPassword from "../../shared/InputPassword";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import { resetPasswordErrorObj, resetPasswordObj } from "../../utils/staticObj";
import validate from "../../utils/validate";
import "./css/auth.css";

const ResetPassword = () => {
  const token = getCookie("authToken");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [passwordObj, setPasswordObj] = useState(resetPasswordObj);
  const [error, setError] = useState(resetPasswordErrorObj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordObj({ ...passwordObj, [name]: value });
    let errors = {};
    if (error[name]) {
      if (name === "confirmPassword") {
        errors[name] = validate(name, value, passwordObj?.password);
      } else if (name === "oldPassword") {
        errors[name] = validate("password", value);
      } else {
        errors[name] = validate(name, value);
      }
      setError({ ...error, ...errors });
    }
  };

  const validation = () => {
    const errors = {};
    Object.entries(passwordObj).forEach(([key, value]) => {
      if (key === "confirmPassword") {
        errors[key] = validate(key, value, passwordObj?.password);
      } else if (key === "oldPassword") {
        errors[key] = validate("password", value);
      } else {
        errors[key] = validate(key, value);
      }
    });
    setError(errors);
    return Object.values(errors).every((val) => !val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      try {
        setLoading(true);
        let response = await postRequest("users/ResetPassword", {
          data: {
            oldPassword: passwordObj.oldPassword,
            Password: passwordObj.password,
            ConfirmPassword: passwordObj.confirmPassword,
          },
          headers: {
            "access-token": token,
          },
        });
        if (response.statusCode === 200) {
          toast.success("password reset successfully.");
          setPasswordObj(resetPasswordObj);
          navigate("/profile");
        } else {
          toast.error(response?.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      {loading && <Loader />}
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          border: "1px solid gray",
          borderRadius: "10px",
          margin: "20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h1 style={{ textAlign: "center", color: "rgb(18, 219, 206)" }}>
            Reset password
          </h1>
          <br />
          <label htmlFor="oldPassword">Old Password:</label>
          {error?.oldPassword && (
            <span className="error">{error.oldPassword}</span>
          )}
          <InputPassword
            placeholder="Old password..."
            id="oldPassword"
            name="oldPassword"
            value={passwordObj.oldPassword}
            onChange={handleChange}
          />
          <label htmlFor="newPassword">New Password:</label>
          {error?.password && <span className="error">{error.password}</span>}
          <InputPassword
            placeholder="New password..."
            id="newPassword"
            name="password"
            value={passwordObj.password}
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          {error?.confirmPassword && (
            <span className="error">{error.confirmPassword}</span>
          )}
          <InputPassword
            placeholder="Confirm password..."
            id="confirmPassword"
            name="confirmPassword"
            value={passwordObj.confirmPassword}
            onChange={handleChange}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <ButtonCom
              type="button"
              onClick={() => {
                setPasswordObj(resetPasswordObj);
                setError(resetPasswordObj);
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap:"5px",
                  color:"red"
                }}
              >
                <img src={cancel} height="15px" width="15px" />
                Cancel
              </span>
            </ButtonCom>
            <ButtonCom type="submit" color='green'>Submit</ButtonCom>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
