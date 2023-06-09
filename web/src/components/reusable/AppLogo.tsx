import logo from "../../assets/logo.svg";

interface Props {
  size?: number;
}

export default function AppLogo({ size = 40 }: Props) {
  return <img src={logo} alt={"logo"} width={size} />;
}
