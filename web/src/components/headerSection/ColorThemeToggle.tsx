import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Theme,
  useTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";

import { COLOR_MODE_KEY } from "../../constants/localStorageKeys";
import { useAppDispatch } from "../../utils/hooks/hooks";
import { setColorMode } from "../../redux/slices/settingsSlice";
import Text from "../reusable/Text";

interface Props {
  ui?: "desktop" | "mobile";
}
export default function ColorThemeToggle({ ui = "desktop" }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const savedMode = localStorage.getItem(COLOR_MODE_KEY) as typeof colorMode;
  const colorMode = theme.palette.mode;

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
      <DesktopUI
        colorMode={colorMode}
        toggleColorMode={toggleColorMode}
        theme={theme}
      />
    );
  else
    return (
      <MobileUI
        colorMode={colorMode}
        toggleColorMode={toggleColorMode}
        theme={theme}
      />
    );
}

interface UIProps {
  colorMode: "dark" | "light";
  toggleColorMode: () => void;
  theme: Theme;
}

const DesktopUI = ({ colorMode, toggleColorMode, theme }: UIProps) => {
  return (
    <IconButton onClick={toggleColorMode} color="inherit" size="small">
      {colorMode === "dark" ? (
        <DarkModeIcon sx={{ width: 30, height: 30 }} />
      ) : (
        <LightModeIcon
          sx={{ color: theme.palette.common.white, width: 30, height: 30 }}
        />
      )}
    </IconButton>
  );
};

const MobileUI = ({ colorMode, toggleColorMode, theme }: UIProps) => {
  const iconColor = theme.palette.text.dark;

  return (
    <ListItem disableGutters>
      <ListItemButton onClick={toggleColorMode}>
        <ListItemIcon>
          {colorMode === "dark" ? (
            <DarkModeIcon sx={{ color: iconColor }} />
          ) : (
            <LightModeIcon sx={{ color: iconColor }} />
          )}
        </ListItemIcon>
        <Text type="subtitle">
          {colorMode === "dark" ? "Light" : "Dark"} Theme
        </Text>
      </ListItemButton>
    </ListItem>
  );
};
