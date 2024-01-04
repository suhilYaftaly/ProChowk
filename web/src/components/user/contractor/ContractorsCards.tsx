import {
  Avatar,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import { IUser } from "@gqlOps/user";
import Text from "@reusable/Text";
import { navigateToUserPage, trimText } from "@/utils/utilFuncs";

interface Props {
  users: IUser[] | undefined;
  loading?: boolean;
}
export default function ContractorsCards({ users, loading }: Props) {
  const navigate = useNavigate();
  const handleContractorClick = (user: IUser) =>
    navigateToUserPage({ user, navigate });

  return (
    <Grid container spacing={1} direction={"column"}>
      {loading ? (
        <Grid item>
          <CardSkeleton />
        </Grid>
      ) : (
        users?.map((user) => (
          <Grid item key={user.id}>
            <ContractorCard
              user={user}
              onClick={() => handleContractorClick(user)}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
}

const avatarSize = 50;
interface IContractorCardProps {
  user: IUser;
  onClick?: () => void;
}
const ContractorCard = ({ user, onClick }: IContractorCardProps) => {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const primary10 = alpha(primaryC, 0.1);

  const cardContSX = {
    p: 1,
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      backgroundColor: primary10,
      borderColor: primaryC,
    },
  };

  return (
    <Card variant={"outlined"} onClick={onClick} sx={cardContSX}>
      <Stack direction={"row"} sx={{ alignItems: "center", mb: 1 }}>
        <Avatar
          alt={user?.name}
          src={user?.image?.url}
          sx={{ width: avatarSize, height: avatarSize, mr: 1 }}
        />
        <Stack>
          <Text type="subtitle">{user.name}</Text>
          <Tooltip title="DUMMY, coming soon!">
            <Rating
              defaultValue={4.4}
              precision={0.5}
              readOnly
              size="small"
              sx={{ color: primaryC }}
            />
          </Tooltip>
        </Stack>
      </Stack>
      {user?.bio && <Text type="body2">{trimText({ text: user.bio })}</Text>}
      <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
        {user?.contractor?.skills?.map((skill) => (
          <Grid item key={skill.label}>
            <Chip label={skill.label} variant="outlined" size="small" />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        {user?.address?.city && (
          <>
            <IconButton size="small">
              <LocationOn
                sx={{
                  border: "2px solid",
                  padding: 0.4,
                  borderRadius: 5,
                  color: theme.palette.text.light,
                }}
              />
            </IconButton>
            <Text type="subtitle">{user?.address?.city}</Text>
          </>
        )}
      </Stack>
    </Card>
  );
};

const CardSkeleton = () => (
  <Card sx={{ p: 1 }} variant="outlined">
    <Stack direction={"row"} sx={{ alignItems: "center" }}>
      <Skeleton variant="circular" width={avatarSize} height={avatarSize} />
      <Stack sx={{ ml: 1 }}>
        <Skeleton variant="text" width={130} />
        <Skeleton variant="text" width={100} />
      </Stack>
    </Stack>
    <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
    <Stack direction={"row"} spacing={1}>
      <ChipSkeleton />
      <ChipSkeleton />
      <ChipSkeleton />
    </Stack>
    <Skeleton variant="rectangular" width={"100%"} height={1} sx={{ my: 2 }} />
    <Stack direction={"row"} spacing={1} alignItems={"center"}>
      <Skeleton variant="circular" width={25} height={25} />
      <Skeleton variant="text" width={60} />
    </Stack>
  </Card>
);
