import { Stack, Tabs, Tab, Alert, Typography, Box } from "@mui/material";
import { useState } from "react";

import MyInfo from "@components/user/userProfile/MyInfo";
import { useUserStates } from "@redux/reduxStates";
import { useRespVal } from "@utils/hooks/hooks";
import { pp } from "@config/configConst";

export default function MyProfile() {
  const { userLocation } = useUserStates();
  const [tabsValue, setTabValue] = useState(0);

  const handleTabChange = (value: number) => setTabValue(value);

  return (
    <Stack direction={useRespVal("column", "row")}>
      <Tabs
        value={tabsValue}
        onChange={(_, value) => handleTabChange(value)}
        variant="scrollable"
        aria-label="my profile tabs"
        orientation={useRespVal("horizontal", "vertical")}
        sx={{
          borderRight: useRespVal(undefined, 1),
          borderBottom: useRespVal(1, undefined),
          borderColor: "divider",
        }}
      >
        <Tab label="My Info" />
        <Tab label="Portfolios" />
        <Tab label="My Location" />
      </Tabs>
      <div style={{ flex: 1 }}>
        <TabPanel value={tabsValue} index={0}>
          <MyInfo />
        </TabPanel>
        <TabPanel value={tabsValue} index={2}>
          {userLocation?.error?.message ? (
            <Alert severity="error">
              {userLocation?.error?.message}. Give permission to see your
              location details
            </Alert>
          ) : (
            <>
              <Typography variant="h5">Coordinate</Typography>
              <Typography>
                {userLocation?.data?.lat}, {userLocation?.data?.lng}
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Address
              </Typography>
              <Typography>{userLocation?.data?.display_name}</Typography>
            </>
          )}
        </TabPanel>
      </div>
    </Stack>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: pp }}>{children}</Box>}
    </div>
  );
}
