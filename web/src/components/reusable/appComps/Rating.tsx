import { Tooltip, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import Text from "@reusable/Text";

export default function Rating() {
  return (
    <Tooltip title="DUMMY, coming soon!">
      <Stack direction={"row"} alignItems={"center"}>
        <StarIcon color="primary" sx={{ width: 22, height: 22, mr: 0.5 }} />
        <Text cColor="primary" sx={{ fontWeight: 700 }}>
          4.8
        </Text>
      </Stack>
    </Tooltip>
  );
}
