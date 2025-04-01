import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from '../layout/Footer';
import Navbar from "../layout/Navbar";

const Home = () => {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <div style={{ marginTop: "20px", flex: "1" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
