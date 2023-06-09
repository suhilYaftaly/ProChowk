import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Divider, Stack, Typography, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface ChipData {
  id: number;
  label: string;
}

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function MyJobTypes() {
  const [myJobs, setMyJobs] = useState<readonly ChipData[]>([
    { id: 0, label: "Floaring" },
    { id: 1, label: "Carpentry" },
    { id: 2, label: "Framing" },
    { id: 3, label: "Plumbing" },
    { id: 4, label: "Landscaping" },
  ]);
  const allJobsList: readonly ChipData[] = [
    { id: 0, label: "Floaring" },
    { id: 1, label: "Carpentry" },
    { id: 2, label: "Framing" },
    { id: 3, label: "Plumbing" },
    { id: 4, label: "Landscaping" },
    { id: 5, label: "Interlocking & Driveway" },
    { id: 6, label: "Basement" },
    { id: 7, label: "Kitchen" },
    { id: 8, label: "Painting" },
    { id: 9, label: "Garage Door" },
    { id: 10, label: "Appliance Repair & Installation" },
    { id: 11, label: "Windown & Doors" },
    { id: 12, label: "Roofing" },
    { id: 13, label: "Electircian" },
    { id: 14, label: "Heating & Air Conditioning" },
  ];

  const handleDelete = (chipToDelete: ChipData) => () => {
    setMyJobs((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
  };

  const handleAdd = (newJob: ChipData) => () => {
    const exists = myJobs.some((j) => j.id === newJob.id);
    if (exists) {
      setMyJobs((pv) => pv.filter((j) => j.id !== newJob.id));
    } else {
      setMyJobs((pv) => [...pv, newJob]);
    }
  };

  return (
    <>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        {myJobs?.length > 0
          ? "Your Selected Job Types"
          : "Select some job types from below section to add it to your list"}
      </Typography>
      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        {myJobs.map((job) => (
          <ListItem key={job.id}>
            <Chip
              label={job.label}
              onDelete={handleDelete(job)}
              color="primary"
              variant="outlined"
            />
          </ListItem>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 2 }}>
        Add new job types from below list to your profile
      </Typography>
      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        {allJobsList.map((job) => {
          const existsInMyJobs = myJobs.some((j) => j.id === job.id);
          return (
            <ListItem key={job.id}>
              <Chip
                label={job.label}
                onClick={handleAdd(job)}
                color="primary"
                variant={existsInMyJobs ? "filled" : "outlined"}
                icon={existsInMyJobs ? <RemoveIcon /> : <AddIcon />}
              />
            </ListItem>
          );
        })}
      </Stack>
    </>
  );
}
