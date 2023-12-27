import { IconButton, Stack, SxProps, Theme, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import Text from "@reusable/Text";
import { iconCircleSX } from "@/styles/sxStyles";

interface Props {
  title: string;
  isMyProfile: boolean;
  setOpenEdit: (toggle: boolean) => void;
  sx?: SxProps<Theme>;
}
export default function EditableTitle({
  title,
  isMyProfile,
  setOpenEdit,
  sx,
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction={"row"}
      sx={{ alignItems: "center", justifyContent: "space-between", ...sx }}
    >
      <Text type="subtitle">{title}</Text>
      {isMyProfile && (
        <IconButton size="small" onClick={() => setOpenEdit(true)}>
          <EditIcon sx={iconCircleSX(theme)} />
        </IconButton>
      )}
    </Stack>
  );
}
