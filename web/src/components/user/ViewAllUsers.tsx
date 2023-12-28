import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardMedia,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useUsers } from "@gqlOps/user.ts";
import { navigateToUserPage } from "@utils/utilFuncs";
import Text from "../reusable/Text";

export default function ViewAllUsers() {
  const navigate = useNavigate();
  const { userAsync, data: allUsers } = useUsers();

  const onShowUsers = () => userAsync();

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Text type="subtitle" sx={{ mb: 2 }} cColor="info">
        ℹ👉 Showing below users profile to (DEVS) only for testing purposes.
      </Text>
      <Button
        onClick={onShowUsers}
        variant="contained"
        fullWidth
        sx={{ mb: 5 }}
      >
        Show All Users
      </Button>
      <Grid container direction={"row"} spacing={1}>
        {allUsers?.users?.map((user) => (
          <Grid item key={user.id}>
            <Card sx={{ width: 180 }}>
              <CardActionArea
                onClick={() => navigateToUserPage({ user, navigate })}
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
    </>
  );
}
