import { Stack } from "@mui/material";
import { ReactNode } from "react";
import { ppy, layoutCardsMaxWidth } from "@config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  /** responsive margin-x, applies to mobile screens*/
  mx?: number;
  /** responsive margin-y*/
  my?: number;
}

export default function CenteredStack({ children, mx, my = ppy }: Props) {
  const mrgx = mx && useRespVal(mx, undefined);
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my,
        mx: mrgx,
      }}
    >
      <Stack sx={{ maxWidth: layoutCardsMaxWidth, width: "100%" }}>
        {children}
      </Stack>
    </Stack>
  );
}
