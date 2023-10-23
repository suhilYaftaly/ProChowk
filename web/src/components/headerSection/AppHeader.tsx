import {
  useTheme,
  alpha,
  useScrollTrigger,
  Card,
  SxProps,
  Theme,
} from "@mui/material";

import { ppx } from "@config/configConst";
import CenteredStack from "@reusable/CenteredStack";
import { useIsMobile } from "@hooks/hooks";
import DHeader from "./desktop/DHeader";
import MHeader from "./mobile/MHeader";

export default function AppHeader() {
  const theme = useTheme();
  const bgColor = alpha(theme.palette.secondary.dark, 0.9);
  const trigger = useScrollTrigger({ threshold: 110 });
  const isMobile = useIsMobile();

  return (
    <Card sx={containerSX(trigger, bgColor)}>
      <CenteredStack my={0}>
        {isMobile ? <MHeader /> : <DHeader />}
      </CenteredStack>
    </Card>
  );
}

const containerSX = (trigger: any, backgroundColor: string) =>
  ({
    position: "sticky",
    top: 0,
    zIndex: 1,
    transition: "opacity 0.2s ease-in-out",
    px: ppx,
    py: 1,
    boxShadow: 1,
    borderRadius: 0,
    backgroundColor,
    opacity: trigger ? 0 : 1,
    pointerEvents: trigger ? "none" : "auto",
  } as SxProps<Theme>);
