import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cancel from "../../assets/cancel.png";
import ButtonCom from "../../shared/ButtonCom";
import InputPassword from "../../shared/InputPassword";
import Loader from "../../shared/Loader";
import { postRequest } from "../../utils/api";
import { getCookie } from "../../utils/getCookie";
import {
  inputs,
  resetPasswordErrorObj,
  resetPasswordObj,
} from "../../utils/staticObj";
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
    setPasswordObj({ ...passwordObj, [name]: value.trim() });
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
    <div className="resetPasswordContainer">
      {loading && <Loader />}
      <div className="resetPasswordInner">
        <form onSubmit={handleSubmit} className="resetPassForm">
          <h1 className="resetPassHeading">Reset password</h1>
          <br />
          {inputs.map((inp) => (
            <Fragment key={inp.id}>
              <label htmlFor={inp.id}>{inp.placeHolder}</label>
              {error[inp.id] && <span className="error">{error[inp.id]}</span>}
              <InputPassword
                placeholder={inp.placeHolder}
                id={inp.id}
                name={inp.id}
                value={passwordObj[inp.id]}
                onChange={handleChange}
              />
            </Fragment>
          ))}
          <div className="reset-btn-container">
            <ButtonCom
              type="button"
              onClick={() => {
                setPasswordObj(resetPasswordObj);
                setError(resetPasswordObj);
              }}
            >
              <span className="btnIcon">
                <img src={cancel} height="15px" width="15px" />
                Cancel
              </span>
            </ButtonCom>
            <ButtonCom type="submit" color="green">
              Submit
            </ButtonCom>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
