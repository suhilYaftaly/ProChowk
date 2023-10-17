import { ApolloProvider } from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

import { client } from "../graphql/apollo-client";
import { store } from "@redux/store";
import { useSettingsStates } from "@redux/reduxStates";
import Routes from "@/routes/Routes";
import { muiTheme } from "@/styles/muiTheme";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Providers() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={clientId}>
          <MUIProvider>
            <Routes />
          </MUIProvider>
        </GoogleOAuthProvider>
      </Provider>
    </ApolloProvider>
  );
}

const MUIProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode: mode } = useSettingsStates();
  const theme = muiTheme(mode);
  const themeColor = theme.palette.secondary.dark;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-navbutton-color" content={themeColor} />
      <meta name="apple-mobile-web-app-status-bar-style" content={themeColor} />
      {children}
    </ThemeProvider>
  );
};
