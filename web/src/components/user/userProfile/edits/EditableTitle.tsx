import { IconButton, Stack, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import Text from "@reusable/Text";
import { iconCircleSX } from "@/styles/sxStyles";

interface Props {
  title: string;
  isMyProfile: boolean;
  setOpenEdit: (toggle: boolean) => void;
}
export default function EditableTitle({
  title,
  isMyProfile,
  setOpenEdit,
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction={"row"}
      sx={{ alignItems: "center", justifyContent: "space-between" }}
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
