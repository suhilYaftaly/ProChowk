import { Button, Card, Grid, Typography } from "@mui/material";
import { useState } from "react";

import MyBasicInfo from "./MyBasicInfo";
import MyJobTypes from "./MyJobTypes";
import MyLicences from "./MyLicences";

export default function MyInfo() {
  const [isAContractor, setIsAContractor] = useState(true);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3} xl={2}>
        <Card sx={{ boxShadow: 4, p: 2 }}>
          <MyBasicInfo />
        </Card>
      </Grid>
      {isAContractor ? (
        <>
          <Grid item xs={12} md={4} lg={5} xl={6}>
            <Card sx={{ boxShadow: 4, p: 2 }}>
              <MyJobTypes />
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <Card sx={{ boxShadow: 4, p: 2 }}>
              <MyLicences />
            </Card>
          </Grid>
        </>
      ) : (
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 4, p: 2 }}>
            <Typography variant="h5" textAlign={"center"}>
              Create your contractor profile to start getting contracts from
              clients
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setIsAContractor(!isAContractor)}
            >
              Create Now
            </Button>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
