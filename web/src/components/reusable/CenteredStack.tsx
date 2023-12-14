import { Card, Stack, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

import { maxWidthPG, pp } from "@config/configConst";
import { useIsMobile, useRespVal } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  /**The system prop, which allows defining system overrides as well as additional CSS styles. */
  sx?: SxProps<Theme>;
  /**The system prop, which allows defining system overrides as well as additional CSS styles. */
  contSX?: SxProps<Theme>;
  /**mobile margin x */
  mmx?: string | number;
  /**add a card as a wrapper around the children? */
  addCard?: boolean;
  /**Card CSS styles. */
  cardSX?: SxProps<Theme>;
}

export default function CenteredStack({
  children,
  sx,
  contSX,
  mmx,
  addCard,
  cardSX,
}: Props) {
  const isMobile = useIsMobile();
  const mx = mmx !== undefined ? useRespVal(mmx, pp) : pp;
  const cardBR = mmx === 0 && isMobile ? 0 : undefined;

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
        {addCard ? (
          <Card sx={{ p: 2, ...cardSX, borderRadius: cardBR }}>{children}</Card>
        ) : (
          children
        )}
      </Stack>
    </Stack>
  );
}
