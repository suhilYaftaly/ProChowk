import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  QrCode,
  LocalPhone,
  LocationOn,
  Settings,
  Edit,
} from "@mui/icons-material";
import { useState } from "react";

import Text from "@reusable/Text";
import Rating from "@reusable/appComps/Rating";
import QRCodeModal from "@reusable/QRCodeModal";
import { userLink } from "@constants/links";
import { formatPhoneNumber, openPhone } from "@utils/utilFuncs";
import { useIsMobile } from "@hooks/hooks";
import { ISectionProps } from "../UserProfile";
import { iconCircleSX } from "@/styles/sxStyles";
import CustomModal from "@reusable/CustomModal";
import UserProfileInfoEdit from "../edits/UserProfileInfoEdit";

export default function UserProfileInfo({
  user,
  isMyProfile,
  p,
}: ISectionProps) {
  const theme = useTheme();
  const chipBg = alpha(theme.palette.success.light, 0.1);
  const [showQRCode, setShowQRCode] = useState(false);
  const isMobile = useIsMobile();
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <Stack direction={"row"} sx={{ alignItems: "center", p }}>
        <Avatar
          alt={user?.name}
          src={user?.image?.url}
          sx={{ width: 80, height: 80 }}
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
          <Stack spacing={1}>
            <div>
              <Tooltip title="DUMMY, coming soon!">
                <Chip
                  label="Available"
                  variant="outlined"
                  color="success"
                  size="small"
                  sx={{ backgroundColor: chipBg }}
                />
              </Tooltip>
            </div>
            <Stack direction={"row"} spacing={1}>
              <Text type="title">{user?.name}</Text>
              <Rating />
            </Stack>
            <Stack
              direction={"row"}
              sx={{ alignItems: "center", color: "grey" }}
            >
              {user?.phoneNum && (
                <Stack
                  direction={"row"}
                  sx={{ alignItems: "center" }}
                  onClick={() => openPhone(user?.phoneNum)}
                >
                  <LocalPhone sx={{ width: 20, height: 20 }} />
                  <Text
                    sx={{ mr: 1, color: "inherit", ml: 0.5, fontWeight: 450 }}
                  >
                    {formatPhoneNumber(user?.phoneNum)}
                  </Text>
                </Stack>
              )}
              <LocationOn sx={{ width: 20, height: 20 }} />
              <Text sx={{ color: "inherit", ml: 0.5, fontWeight: 450 }}>
                {user?.address?.city}, {user?.address?.stateCode}
              </Text>
            </Stack>
          </Stack>
          {!isMobile && (
            <Stack direction={"row"} alignItems={"row"}>
              <IconButton size="small" onClick={() => setShowQRCode(true)}>
                <QrCode sx={iconCircleSX(theme)} />
              </IconButton>
              {isMyProfile && (
                <>
                  <IconButton size="small">
                    <Settings sx={iconCircleSX(theme)} />
                  </IconButton>
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
                <IconButton size="small">
                  <Settings sx={iconCircleSX(theme)} />
                  <Text sx={{ ml: 1, fontWeight: 500 }}>Settings</Text>
                </IconButton>
                <IconButton size="small">
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
        <CustomModal
          title="Edit Profile Info"
          open={openEdit}
          onClose={setOpenEdit}
        >
          <UserProfileInfoEdit user={user} onClose={() => setOpenEdit(false)} />
        </CustomModal>
      )}
    </>
  );
}
