import { Stack } from "@mui/material";
import { ReactNode } from "react";
import { ppy, layoutCardsMaxWidth } from "@config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  /** responsive margin-x, applies to mobile screens*/
  mx?: number;
}

export default function CenteredStack({ children, mx }: Props) {
  const mrgx = mx && useRespVal(mx, undefined);
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: ppy,
        mx: mrgx,
      }}
    >
      <Stack sx={{ maxWidth: layoutCardsMaxWidth, width: "100%" }}>
        {children}
      </Stack>
    </Stack>
  );
}
