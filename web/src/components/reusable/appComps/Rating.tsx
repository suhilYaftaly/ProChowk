import { Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import Text from "@reusable/Text";

type Props = { averageRating: number | undefined };
export default function Rating({ averageRating }: Props) {
  if (!averageRating || averageRating < 0.1) return null;
  return (
    <Stack direction={"row"} alignItems={"center"}>
      <StarIcon color="primary" sx={{ width: 22, height: 22, mr: 0.5 }} />
      <Text cColor="primary" sx={{ fontWeight: 700 }}>
        {averageRating}
      </Text>
    </Stack>
  );
}
