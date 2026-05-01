import React from "react";
import logoImage from "./Logo.png";

function Logo({ width = "100px" }) {
  return (
    <img
      src={logoImage}
      alt="SpilledTea logo"
      style={{ width }}
      className="inline-block"
    />
  );
}

export default Logo;