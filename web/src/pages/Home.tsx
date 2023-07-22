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

import userOps, { ISearchAllUsersData } from "@gqlOps/user.ts";
import { paths } from "@/routes/PageRoutes";
import CenteredStack from "@reusable/CenteredStack";
import { ppx } from "@/config/configConst";

export default function Home() {
  const navigate = useNavigate();
  const { data: allUsers } = useQuery<ISearchAllUsersData, {}>(
    userOps.Queries.searchAllUsers
  );

  return (
    <CenteredStack mx={ppx}>
      <Grid container direction={"row"} spacing={1}>
        {allUsers?.searchAllUsers?.map((user) => (
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
                  image={user?.image?.picture}
                  alt={user?.name}
                  sx={{ maxHeight: 170 }}
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
    </CenteredStack>
  );
}
