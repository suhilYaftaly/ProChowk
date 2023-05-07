import Stack from "@mui/joy/Stack";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Box, IconButton } from "@mui/material";

import logo from "../../assets/Logo.png";
import { COLOR_MODE_KEY } from "../../constants/localStorageKeys";

export type ModeType = "light" | "dark";

interface Props {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

export default function Header({ mode, setMode }: Props) {
  const toggleColorMode = () => {
    const assignMode = mode === "light" ? "dark" : "light";
    setMode(assignMode);
    localStorage.setItem(COLOR_MODE_KEY, assignMode);
  };

  return (
    <Stack
      direction="row"
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <img src={logo} alt={"logo"} width={70} />
      <Box>
        {mode} mode
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
    </Stack>
  );
}
