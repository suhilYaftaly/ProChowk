import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  QrCode,
  LocalPhone,
  LocationOn,
  Settings,
  Edit,
  Email,
} from "@mui/icons-material";
import { useState } from "react";

import Text from "@reusable/Text";
import Rating from "@reusable/appComps/Rating";
import QRCodeModal from "@reusable/QRCodeModal";
import { userLink } from "@constants/links";
import { formatPhoneNumber, openEmail, openPhone } from "@utils/utilFuncs";
import { useIsMobile } from "@hooks/hooks";
import { ISectionProps } from "../UserProfile";
import { iconCircleSX } from "@/styles/sxStyles";
import CustomModal from "@reusable/CustomModal";
import UserProfileInfoEdit from "../edits/UserProfileInfoEdit";

export default function UserProfileInfo({
  user,
  isMyProfile,
  p,
  userLoading,
}: ISectionProps) {
  const theme = useTheme();
  const [showQRCode, setShowQRCode] = useState(false);
  const isMobile = useIsMobile();
  const [openEdit, setOpenEdit] = useState(false);
  const avatarSize = 80;

  if (userLoading) return <ProfileSkeleton p={p} avatarSize={avatarSize} />;
  return (
    <>
      <Stack direction={"row"} sx={{ alignItems: "center", p }}>
        <Avatar
          alt={user?.name}
          src={user?.image?.url}
          sx={{ width: avatarSize, height: avatarSize }}
        />
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            ml: 2,
            flex: 1,
          }}
        >
          <Stack>
            <Stack direction={"row"} spacing={1} sx={{ mb: 1 }}>
              <Text type="title">{user?.name}</Text>
              <Rating />
            </Stack>
            <Grid container sx={{ color: "grey" }} spacing={1}>
              {user?.phoneNum && (
                <Grid item onClick={() => openPhone(user?.phoneNum)}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <LocalPhone sx={{ width: 20, height: 20 }} />
                    <Text sx={{ color: "inherit", ml: 0.5, fontWeight: 450 }}>
                      {formatPhoneNumber(user?.phoneNum)}
                    </Text>
                  </Stack>
                </Grid>
              )}
              {user?.address && (
                <Grid item>
                  <Stack direction={"row"} alignItems={"center"}>
                    <LocationOn sx={{ width: 20, height: 20 }} />
                    <Text sx={{ color: "inherit", ml: 0.5, fontWeight: 450 }}>
                      {user?.address?.city}, {user?.address?.stateCode}
                    </Text>
                  </Stack>
                </Grid>
              )}
              <Grid
                item
                onClick={() =>
                  isMobile && user?.email && openEmail({ email: user?.email })
                }
              >
                <Stack direction={"row"} alignItems={"center"}>
                  <Email sx={{ width: 20, height: 20 }} />
                  <Text sx={{ color: "inherit", ml: 0.5, fontWeight: 450 }}>
                    {user?.email}
                  </Text>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
          {!isMobile && (
            <Stack direction={"row"}>
              <IconButton size="small" onClick={() => setShowQRCode(true)}>
                <QrCode sx={iconCircleSX(theme)} />
              </IconButton>
              {isMyProfile && (
                <>
                  <Tooltip title="DUMMY, coming soon!">
                    <IconButton size="small">
                      <Settings sx={iconCircleSX(theme)} />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={() => setOpenEdit(true)}>
                    <Edit sx={iconCircleSX(theme)} />
                  </IconButton>
                </>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
      {isMobile && (
        <>
          <Divider sx={{ mx: p, mt: p }} />
          <Stack
            direction={"row"}
            sx={{ alignItems: "center", justifyContent: "space-evenly", p }}
          >
            <IconButton size="small" onClick={() => setShowQRCode(true)}>
              <QrCode sx={iconCircleSX(theme)} />
              <Text sx={{ ml: 1, fontWeight: 500 }}>QR Code</Text>
            </IconButton>
            {isMyProfile && (
              <>
                <Tooltip title="DUMMY, coming soon!">
                  <IconButton size="small">
                    <Settings sx={iconCircleSX(theme)} />
                    <Text sx={{ ml: 1, fontWeight: 500 }}>Settings</Text>
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={() => setOpenEdit(true)}>
                  <Edit sx={iconCircleSX(theme)} />
                  <Text sx={{ ml: 1, fontWeight: 500 }}>Edit</Text>
                </IconButton>
              </>
            )}
          </Stack>
        </>
      )}
      {user && (
        <QRCodeModal
          modalTitle="Profile QR Code."
          description="Print and stick it in your truck, sign boards, shop window and etc."
          fileName={user.name}
          value={userLink(`${user?.name}-${user?.id}`)}
          showModal={showQRCode}
          setShowModal={setShowQRCode}
        />
      )}
      {isMyProfile && user && (
        <CustomModal title="Profile Info" open={openEdit} onClose={setOpenEdit}>
          <UserProfileInfoEdit user={user} onClose={() => setOpenEdit(false)} />
        </CustomModal>
      )}
    </>
  );
}

interface SProps {
  p: number;
  avatarSize: number;
}
const ProfileSkeleton = ({ p, avatarSize }: SProps) => {
  return (
    <>
      <Stack direction={"row"} sx={{ alignItems: "center", p }}>
        <Skeleton
          variant="circular"
          sx={{ width: avatarSize, height: avatarSize }}
        />
        <Stack sx={{ ml: 2 }}>
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={200} />
        </Stack>
      </Stack>
    </>
  );
};
