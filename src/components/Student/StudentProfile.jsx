import { NavLink, Outlet } from "react-router-dom";
import './css/studentNav.css'

const StudentProfile = () => {
  return (
    <div className="stuContainer">
      <nav className="StudentNavbar">
        <NavLink
          style={{ padding: "25px" }}
          className={({ isActive }) => (isActive ? "StuActive" : " ")}
          to="/profile/editName"
        >
          Edit Name
        </NavLink>
        <NavLink
          style={{ padding: "25px" }}
          className={({ isActive }) => (isActive ? "StuActive" : "")}
          to="/profile/resetPassword"
        >
          Change Password
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default StudentProfile;
