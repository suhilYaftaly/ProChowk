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

import userOps, { IUsersData } from "@gqlOps/user.ts";
import { paths } from "@/routes/Routes";

export default function ViewAllUsers() {
  const navigate = useNavigate();
  const { data: allUsers } = useQuery<IUsersData, {}>(userOps.Queries.users);

  return (
    <Grid container direction={"row"} spacing={1}>
      {allUsers?.users?.map((user) => (
        <Grid item key={user.id}>
          <Card sx={{ width: 180 }}>
            <CardActionArea
              onClick={() => {
                const username = `${user.name}-${user.id}`.replace(/\s/g, "");
                navigate(paths.user(username));
              }}
            >
              <CardMedia
                component="img"
                image={user?.image?.url || "https://placehold.co/180x180"}
                alt={user?.name}
                sx={{ maxHeight: 180 }}
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
  );
}
