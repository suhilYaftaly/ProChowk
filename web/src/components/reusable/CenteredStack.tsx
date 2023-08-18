import { Stack, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

import { ppy, layoutCardsMaxWidth } from "@config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  /** responsive margin-x, applies to mobile screens*/
  mx?: number;
  /** responsive margin-y*/
  my?: number;
  /**The system prop, which allows defining system overrides as well as additional CSS styles. */
  sx?: SxProps<Theme>;
}

export default function CenteredStack({ children, mx, my = ppy, sx }: Props) {
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
      <Stack sx={{ maxWidth: layoutCardsMaxWidth, width: "100%", ...sx }}>
        {children}
      </Stack>
    </Stack>
  );
}
