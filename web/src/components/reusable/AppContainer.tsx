import { ReactNode } from "react";
import { Card, SxProps, Theme, Stack } from "@mui/material";

import { maxWidthPG, pp } from "@config/configConst";
import { useIsMobile, useRespVal } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  /**container CSS styles. */
  sx?: SxProps<Theme>;
  /**add a card as a wrapper around the children? */
  addCard?: boolean;
  /**Card CSS styles. */
  cardSX?: SxProps<Theme>;
}
export default function AppContainer({ children, sx, addCard, cardSX }: Props) {
  const isMobile = useIsMobile();
  const cardBR = isMobile ? 0 : 1;
  const m = useRespVal(0, pp);

  return (
    <Stack sx={{ alignItems: "center", m, ...sx }}>
      <Stack sx={{ maxWidth: maxWidthPG, width: "100%" }}>
        {addCard ? (
          <Card sx={{ p: pp, borderRadius: cardBR, ...cardSX }}>
            {children}
          </Card>
        ) : (
          children
        )}
      </Stack>
    </Stack>
  );
}
