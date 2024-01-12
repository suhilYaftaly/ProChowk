import {
  Avatar,
  Card,
  CardActionArea,
  Rating,
  Stack,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import { Sms } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { IUser } from "@gqlOps/user";
import Text from "../reusable/Text";
import { navigateToUserPage } from "@/utils/utilFuncs";

type Props = { user: IUser };
export default function ChatWithUserCard({ user }: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const userCardBGC = alpha(theme.palette.secondary.light, 0.2);
  const primaryC = theme.palette.primary.main;
  const iconColor = theme.palette.secondary.dark;

  //TODO: implement chatting
  const onPosterClick = () => navigateToUserPage({ user, navigate });

  return (
    <Tooltip title="DUMMY, chatting coming soon!">
      <Card variant="outlined" sx={{ backgroundColor: userCardBGC }}>
        <CardActionArea sx={{ p: 2 }} onClick={onPosterClick}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction={"row"}>
              <Avatar
                alt={user?.name}
                src={user?.image?.url}
                sx={{ width: 50, height: 50, mr: 1 }}
              />
              <Stack>
                <Text type="subtitle">{user?.name}</Text>
                <Rating
                  defaultValue={4.4}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ color: primaryC }}
                />
              </Stack>
            </Stack>
            <Sms sx={{ width: 30, height: 30, color: iconColor }} />
          </Stack>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
}
