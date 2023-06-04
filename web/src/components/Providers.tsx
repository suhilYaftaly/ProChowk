import { ApolloProvider } from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { ReactNode, useMemo } from "react";

import { GOOGLE_CLIENT_ID } from "../config/tempConfig";
import { client } from "../graphql/apollo-client";
import { store } from "../redux/store";
import { useSettingsStates } from "../redux/reduxStates";
import useUserLocation from "./user/useUserLocation";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <MUIProvider>{children}</MUIProvider>
        </GoogleOAuthProvider>
      </Provider>
    </ApolloProvider>
  );
}

const MUIProvider = ({ children }: { children: ReactNode }) => {
  useUserLocation();
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
