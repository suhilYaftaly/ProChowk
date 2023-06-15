import { useQuery } from "@apollo/client";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AllCards from "@components/detailsSection/cards/AllCards.tsx";
import userOps, { ISearchAllUsersData } from "@gqlOps/user.ts";
import { paths } from "@/routes/PageRoutes";

export default function Home() {
  const navigate = useNavigate();
  const { data: allUsers } = useQuery<ISearchAllUsersData, {}>(
    userOps.Queries.searchAllUsers
  );

  return (
    <>
      <Grid container direction={"row"} spacing={1} sx={{ m: 1 }}>
        {allUsers?.searchAllUsers?.map((user) => (
          <Grid item key={user.id}>
            <Card sx={{ width: 200 }}>
              <CardActionArea
                onClick={() => {
                  const username = `${user.name}-${user.id}`.replace(/\s/g, "");
                  navigate(paths.user(username));
                }}
              >
                <CardMedia
                  component="img"
                  image={user?.image?.picture}
                  alt={user?.name}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="ellipsis2Line"
                  >
                    {user.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AllCards />
    </>
  );
}
