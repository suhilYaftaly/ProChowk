import { IconButton, ListItem, ListItemButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";

import { useSettingsStates } from "../../redux/reduxStates";
import { COLOR_MODE_KEY } from "../../constants/localStorageKeys";
import { useAppDispatch } from "../../utils/hooks/hooks";
import { setColorMode } from "../../redux/slices/settingsSlice";
import Text from "../reusable/Text";

interface Props {
  ui?: "desktop" | "mobile";
}
export default function ColorModeToggle({ ui = "desktop" }: Props) {
  const dispatch = useAppDispatch();
  const { colorMode } = useSettingsStates();
  const savedMode = localStorage.getItem(COLOR_MODE_KEY) as typeof colorMode;

  useEffect(() => {
    if (savedMode) dispatch(setColorMode(savedMode));
  }, [savedMode]);

  const toggleColorMode = () => {
    const assignMode = colorMode === "light" ? "dark" : "light";
    dispatch(setColorMode(assignMode));
    localStorage.setItem(COLOR_MODE_KEY, assignMode);
  };

  if (ui === "desktop")
    return (
      <DesktopUI colorMode={colorMode} toggleColorMode={toggleColorMode} />
    );
  else
    return <MobileUI colorMode={colorMode} toggleColorMode={toggleColorMode} />;
}

interface UIProps {
  colorMode: "dark" | "light";
  toggleColorMode: () => void;
}

const DesktopUI = ({ colorMode, toggleColorMode }: UIProps) => {
  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {colorMode === "dark" ? (
        <DarkModeIcon sx={{ width: 30, height: 30 }} />
      ) : (
        <LightModeIcon sx={{ color: "white", width: 30, height: 30 }} />
      )}
    </IconButton>
  );
};

const MobileUI = ({ colorMode, toggleColorMode }: UIProps) => {
  return (
    <ListItem disableGutters>
      <ListItemButton
        sx={{ justifyContent: "space-between" }}
        onClick={toggleColorMode}
      >
        <Text type="subtitle">
          {colorMode === "dark" ? "Light" : "Dark"} Mode
        </Text>
        {colorMode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
      </ListItemButton>
    </ListItem>
  );
};
