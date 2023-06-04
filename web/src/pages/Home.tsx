import { Box, Button, Stack, Tab, Tabs, TextField } from "@mui/material";
import { FormEvent, useState } from "react";
import { useLazyQuery } from "@apollo/client";

import AllCards from "../components/detailsSection/cards/AllCards.tsx";
import {
  ISearchUserInput,
  ISearchUsersData,
} from "../graphql/operations/user.ts";
import userOps from "../graphql/operations/user.ts";

export default function Home() {
  const [value, setValue] = useState(0);
  const [username, setUsername] = useState("");
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    ISearchUsersData,
    ISearchUserInput
  >(userOps.Queries.searchUsers);

  const onSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    searchUsers({ variables: { username } });
  };
  console.log("SEARCHED USER", data);

  const handleChange = (value: number) => setValue(value);

  return (
    <>
      <Stack
        component="form"
        sx={{ mt: 3 }}
        spacing={2}
        noValidate
        autoComplete="off"
        width={300}
        onSubmit={onSearch}
      >
        <TextField
          key={"username"}
          id={"username"}
          label={"username"}
          variant="outlined"
          name={"username"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          Search User
        </Button>
      </Stack>
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
