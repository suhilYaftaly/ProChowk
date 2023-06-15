import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";

interface Props {
  size?: number;
}

export default function AppLogo({ size = 40 }: Props) {
  return (
    <NavLink to={"/"}>
      <img src={logo} alt={"logo"} width={size} />
    </NavLink>
  );
}
