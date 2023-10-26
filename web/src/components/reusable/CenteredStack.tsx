import { Stack, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

import { maxWidthPG, pp } from "@config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  /**The system prop, which allows defining system overrides as well as additional CSS styles. */
  sx?: SxProps<Theme>;
  /**The system prop, which allows defining system overrides as well as additional CSS styles. */
  contSX?: SxProps<Theme>;
  /**mobile margin x */
  mmx?: string | number;
}

export default function CenteredStack({ children, sx, contSX, mmx }: Props) {
  const mx = mmx !== undefined ? useRespVal(mmx, pp) : pp;

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: pp,
        mx,
        ...contSX,
      }}
    >
      <Stack sx={{ maxWidth: maxWidthPG, width: "100%", ...sx }}>
        {children}
      </Stack>
    </Stack>
  );
}
