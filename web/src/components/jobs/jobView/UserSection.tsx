import { Stack, Skeleton, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  convertUnixToDate,
  getBasicAdd,
  navigateToUserPage,
  openPhone,
} from "@utils/utilFuncs";
import { IUser } from "@gqlOps/user";

interface Props {
  loading: boolean;
  user: IUser | undefined;
}

export default function UserSection({ user, loading }: Props) {
  const navigate = useNavigate();
  const navigateToUser = () => navigateToUserPage({ user, navigate });

  return (
    <Stack>
      <Stack spacing={2} direction={"row"} sx={{ alignItems: "center" }}>
        {loading ? (
          <Skeleton variant="circular" width={120} height={120} />
        ) : (
          <Avatar
            alt={user?.name}
            src={user?.image?.url}
            sx={{ width: 120, height: 120, cursor: "pointer" }}
            onClick={navigateToUser}
          />
        )}
        {loading ? (
          <Stack>
            <Skeleton variant="text" width={150} />
            <Skeleton variant="text" width={150} />
          </Stack>
        ) : (
          <Stack>
            <Typography
              variant="h5"
              onClick={navigateToUser}
              sx={{ cursor: "pointer" }}
            >
              {user?.name}
            </Typography>
            <Typography color="text.secondary">
              Joined {convertUnixToDate(user?.createdAt)?.monthDayYear}
            </Typography>
          </Stack>
        )}
      </Stack>
      {!loading && (
        <>
          <Stack
            direction={"row"}
            sx={{
              my: 2,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Stack>
              {loading ? (
                <>
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={150} />
                </>
              ) : (
                <>
                  <Typography onClick={() => openPhone(user?.phoneNum)}>
                    {user?.phoneNum}
                  </Typography>
                  {user?.address && (
                    <Typography variant="body2" color={"text.secondary"}>
                      {getBasicAdd(user.address)}
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
