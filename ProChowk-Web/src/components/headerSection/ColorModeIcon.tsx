import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";

import { useSettingsStates } from "../../redux/reduxStates";
import { COLOR_MODE_KEY } from "../../constants/localStorageKeys";
import { useAppDispatch } from "../../utils/hooks/hooks";
import { setColorMode } from "../../redux/slices/settingsSlice";

export default function ColorModeIcon() {
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

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {colorMode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
