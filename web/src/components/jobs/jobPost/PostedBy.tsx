import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { navigateToUserPage } from "@/utils/utilFuncs";
import { IUser } from "@gqlOps/user";
import Text from "@reusable/Text";
import { useIsMobile } from "@hooks/hooks";
import Rating from "@reusable/appComps/Rating";

interface Props {
  loading: boolean;
  user: IUser | undefined;
  title?: string;
  userAvgRating: number | undefined;
}
export default function PostedBy({
  loading,
  user,
  title,
  userAvgRating,
}: Props) {
  const navigate = useNavigate();
  const navigateToUser = () => navigateToUserPage({ user, navigate });
  const isMobile = useIsMobile();

  return (
    <>
      {loading ? (
        <CompSkeleton />
      ) : (
        <>
          {!isMobile && title && (
            <>
              <Text cColor="dark" sx={{ mx: 2, my: 1, fontWeight: 550 }}>
                {title}
              </Text>
              <Divider />
            </>
          )}
          <List component="nav">
            <ListItem disableGutters>
              <ListItemButton onClick={navigateToUser}>
                <Avatar
                  alt={user?.name}
                  src={user?.image?.url}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Stack
                  direction={"row"}
                  sx={{
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {isMobile && title && <Text>{title}</Text>}
                    <Text type="subtitle">{user?.name}</Text>
                    {!isMobile && <Rating averageRating={userAvgRating} />}
                  </div>
                  {isMobile && <Rating averageRating={userAvgRating} />}
                </Stack>
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </>
  );
}

const CompSkeleton = () => (
  <>
    <List component="nav">
      <ListItem sx={{ my: 1 }}>
        <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
        <Skeleton variant="text" sx={{ width: 150 }} />
      </ListItem>
    </List>
  </>
);
