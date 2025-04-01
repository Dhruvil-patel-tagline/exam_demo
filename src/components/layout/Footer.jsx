const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        padding: "18px",
        background: "black",
      }}
    >
      &copy; copyright {new Date().getFullYear()}{" "}
      <span style={{ color: "rgb(18, 219, 206)" }}>Tagline Test System</span>{" "}
      all right are reserved
    </div>
  );
};

export default Footer;
