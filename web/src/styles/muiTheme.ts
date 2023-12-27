import { ThemeMode } from "@rSlices/settingsSlice";
import { createTheme } from "@mui/material";

/**common colors*/
const cc = {
  error: "#FF5050",
  info: "#3498db",
  warning: "#f1c40f",
  success: "#00BD40",
  white: "#fff",
  dark: "#121212",
};

/**light mode colors*/
const lc = {
  text: { dark: "#023047", /*900*/ main: "#3B3356", light: "#716A85" },
  primary: { main: "#ff5f15" /*500*/ },
  secondary: { main: "#275775" /*700*/ },
  bg: "#EAF1FB",
  icon: { main: "#716A85" },
  border: { main: "#DBD9E0" },
};

/**dark mode colors*/
const dc = {
  text: { dark: cc.white, main: cc.white, light: cc.white },
};

export const muiTheme = (mode: ThemeMode) => {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: lc.bg,
              paper: cc.white,
            },
            primary: {
              main: lc.primary.main,
              contrastText: cc.white,
            },
            secondary: {
              dark: lc.text.dark,
              main: lc.secondary.main,
              contrastText: cc.white,
            },
            success: { main: cc.success, contrastText: cc.white },
            info: { main: cc.info, contrastText: cc.white },
            warning: { main: cc.warning },
            error: { main: cc.error, contrastText: cc.white },
            text: {
              dark: lc.text.dark,
              main: lc.text.main,
              light: lc.text.light,
            },
            iconColor: { main: lc.icon.main },
          }
        : {
            background: {
              default: "#0A1929",
              paper: "#0A1929",
            },
            primary: {
              main: "#f3723f", //400
              contrastText: cc.white,
            },
            secondary: {
              //TODO: change the colors to appropriate colors
              dark: lc.text.dark,
              main: lc.secondary.main,
              contrastText: cc.white,
            },
            success: { main: cc.success, contrastText: cc.white },
            info: { main: cc.info, contrastText: cc.white },
            warning: { main: cc.warning },
            error: { main: cc.error, contrastText: cc.white },
            text: {
              dark: dc.text.dark,
              main: dc.text.main,
              light: dc.text.light,
            },
          }),
    },
    components: {
      MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 25 } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 8 } } },
      ...(mode === "light" && {
        MuiChip: {
          styleOverrides: {
            root: {
              color: lc.text.dark,
              fontWeight: "450",
            },
            filled: { backgroundColor: lc.bg },
            outlined: { borderColor: lc.text.dark },
            colorPrimary: {
              color: lc.primary.main,
              "&.MuiChip-filled": {
                color: cc.white,
                backgroundColor: lc.primary.main,
              },
              "&.MuiChip-outlined": { borderColor: lc.primary.main },
            },
            colorSecondary: {
              color: lc.secondary.main,
              "&.MuiChip-filled": {
                color: cc.white,
                backgroundColor: lc.secondary.main,
              },
              "&.MuiChip-outlined": { borderColor: lc.secondary.main },
            },
            colorSuccess: {
              color: cc.success,
              "&.MuiChip-filled": {
                color: cc.white,
                backgroundColor: cc.success,
              },
              "&.MuiChip-outlined": { borderColor: cc.success },
            },
            colorInfo: {
              color: cc.info,
              "&.MuiChip-filled": {
                color: cc.white,
                backgroundColor: cc.info,
              },
              "&.MuiChip-outlined": { borderColor: cc.info },
            },
            colorWarning: {
              color: cc.warning,
              "&.MuiChip-filled": {
                color: cc.dark,
                backgroundColor: cc.warning,
              },
              "&.MuiChip-outlined": { borderColor: cc.warning },
            },
            colorError: {
              color: cc.error,
              "&.MuiChip-filled": {
                color: cc.white,
                backgroundColor: cc.error,
              },
              "&.MuiChip-outlined": { borderColor: cc.error },
            },
          },
        },
      }),
    },
    // typography: { fontFamily: "Mulish, Roboto, Arial, sans-serif" },
  });
};

declare module "@mui/material/styles" {
  interface TypeText {
    light?: string;
    main?: string;
    dark?: string;
  }
  interface TypeTextOptions {
    light?: string;
    main?: string;
    dark?: string;
  }

  interface Palette {
    iconColor?: { main?: string };
  }
  interface PaletteOptions {
    iconColor?: { main?: string };
  }
}
