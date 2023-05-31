import { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Tabs,
  Tab,
  Stack,
  SxProps,
  Theme,
  Typography,
  Alert,
} from "@mui/material";

import { useUserStates } from "../../../redux/reduxStates";
import FullScreenModal from "../../reusable/FullScreenModal";
import MyInfo from "./MyInfo";
import { useRespVal } from "../../../utils/hooks/hooks";

interface Props {
  onScreenClose: () => void;
}

export default function MyProfile({ onScreenClose }: Props) {
  const { user, userLocation } = useUserStates();
  const [openModal, setOpenModal] = useState(false);
  const [tabsValue, setTabValue] = useState(0);

  const handleTabChange = (value: number) => setTabValue(value);
  const handeOpenModal = () => setOpenModal(true);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handeOpenModal}>
          <ListItemIcon>
            <Avatar
              alt={user?.name}
              src={user?.picture?.picture}
              sx={{ width: 24, height: 24 }}
            />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </ListItemButton>
      </ListItem>
      <FullScreenModal
        open={openModal}
        setOpen={setOpenModal}
        title="My Profile"
        onClose={onScreenClose}
      >
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
            <Tab label="My Location" />
            <Tab label="Item 3" />
          </Tabs>
          <TabPanel value={tabsValue} index={0}>
            <MyInfo />
          </TabPanel>
          <TabPanel value={tabsValue} index={1}>
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
        </Stack>
      </FullScreenModal>
    </>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const boxStyle: SxProps<Theme> = useRespVal(
    { pt: 3 } as SxProps<Theme>,
    { p: 3 } as SxProps<Theme>
  );

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={boxStyle}>{children}</Box>}
    </div>
  );
}
