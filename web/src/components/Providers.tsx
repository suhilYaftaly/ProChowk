import { ApolloProvider } from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { ReactNode, useMemo } from "react";

import { client } from "../graphql/apollo-client";
import { store } from "@redux/store";
import { useSettingsStates } from "@redux/reduxStates";
import useUserLocation from "./user/useUserLocation";
import PageRoutes from "@/routes/PageRoutes";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Providers() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={clientId}>
          <MUIProvider>
            <PageRoutes />
          </MUIProvider>
        </GoogleOAuthProvider>
      </Provider>
    </ApolloProvider>
  );
}

const MUIProvider = ({ children }: { children: ReactNode }) => {
  useUserLocation();
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  light: "#f3723f", //400
                  main: "#d94f14", //700
                  dark: "#b23c0a", //900
                  contrastText: "#fff",
                },
                secondary: {
                  light: "#9878dd",
                  main: "#683dcd",
                  dark: "#4f30be",
                  contrastText: "#fff",
                },
              }
            : {
                background: {
                  default: "#0A1929",
                  paper: "#0A1929",
                },
                primary: {
                  light: "#f8ab8f", //200
                  main: "#f3723f", //400
                  dark: "#d94f14", //700
                  contrastText: "#000",
                },
                secondary: {
                  light: "#b6a0e6",
                  main: "#805ad5",
                  dark: "#5e38c7",
                  contrastText: "#000",
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
