import { NavLink } from "react-router-dom";
import { CSSProperties } from "react";

import logo from "../../assets/logo.svg";

interface Props {
  size?: number;
  /**NavLink Style, parent container of img */
  linkStyle?: CSSProperties;
}

export default function AppLogo({ size = 40, linkStyle }: Props) {
  return (
    <NavLink style={{ display: "flex", ...linkStyle }} to={"/"}>
      <img src={logo} alt={"logo"} width={size} />
    </NavLink>
  );
}
