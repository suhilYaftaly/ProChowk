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
} from "@mui/material";

import { useUserStates } from "../../../../redux/reduxStates";
import FullScreenModal from "../../../reusable.tsx/FullScreenModal";
import MyInfo from "./MyInfo";
import { useGetSSV } from "../../../../utils/hooks";

interface Props {
  onScreenClose: () => void;
}

export default function MyProfile({ onScreenClose }: Props) {
  const { user } = useUserStates();
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
        <Stack direction={useGetSSV("column", "row")}>
          <Tabs
            value={tabsValue}
            onChange={(_, value) => handleTabChange(value)}
            variant="scrollable"
            aria-label="my profile tabs"
            orientation={useGetSSV("horizontal", "vertical")}
            sx={{
              borderRight: useGetSSV(undefined, 1),
              borderBottom: useGetSSV(1, undefined),
              borderColor: "divider",
            }}
          >
            <Tab label="My Info" />
            <Tab label="Item 2" />
            <Tab label="Item 3" />
          </Tabs>
          <TabPanel value={tabsValue} index={0}>
            <MyInfo />
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
  const boxStyle: SxProps<Theme> = useGetSSV(
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
