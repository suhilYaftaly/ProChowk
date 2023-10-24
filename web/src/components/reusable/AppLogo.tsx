import { NavLink } from "react-router-dom";
import { CSSProperties } from "react";

import logo from "../../assets/logo.svg";
import Text from "./Text";

interface Props {
  size?: number;
  /**NavLink Style, parent container of img */
  linkStyle?: CSSProperties;
  /**@default "icon" */
  type?: "icon" | "text";
}

export default function AppLogo({
  size = 40,
  linkStyle,
  type = "icon",
}: Props) {
  return (
    <NavLink
      style={{ display: "flex", textDecoration: "none", ...linkStyle }}
      to={"/"}
    >
      {type === "icon" && <img src={logo} alt={"logo"} width={size} />}
      {type === "text" && (
        <Text cColor="primary" type="subtitle" sx={{ fontWeight: "600" }}>
          Nexa
          <span style={{ color: "white" }}>Bind</span>.
        </Text>
      )}
    </NavLink>
  );
}
