import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import AllCards from "../components/detailsSection/cards/AllCards";

export default function MainDashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (value: number) => setValue(value);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={(_, value) => handleChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="service category tabs"
        >
          <Tab label="Floaring" />
          <Tab label="Carpentry" />
          <Tab label="Framing" />
          <Tab label="Plumbing" />
          <Tab label="Interlocking & Driveway" />
          <Tab label="Landscaping" />
          <Tab label="Basement" />
          <Tab label="Kitchen" />
          <Tab label="Painting" />
          <Tab label="Garage Door" />
          <Tab label="Appliance Repair & Installation" />
          <Tab label="Windown & Doors" />
          <Tab label="Roofing" />
          <Tab label="Electircian" />
          <Tab label="Heating & Air Conditioning" />
        </Tabs>
      </Box>
      <AllCards />;
    </>
  );
}
