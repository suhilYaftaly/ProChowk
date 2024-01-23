import { Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import Text from "@reusable/Text";

type Props = { averageRating: number };
export default function Rating({ averageRating }: Props) {
  return (
    <Stack direction={"row"} alignItems={"center"}>
      <StarIcon color="primary" sx={{ width: 22, height: 22, mr: 0.5 }} />
      <Text cColor="primary" sx={{ fontWeight: 700 }}>
        {averageRating}
      </Text>
    </Stack>
  );
}
