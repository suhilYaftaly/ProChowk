import { Button, CircularProgress, SxProps, Theme } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

import { formatRelativeTime } from "@/utils/utilFuncs";
import { TBid } from "@gqlOps/jobBid";
import { useIsMobile } from "@/utils/hooks/hooks";

type Props = {
  existingBid: TBid | undefined;
  onClick: () => void;
  loading: boolean;
};
export default function JobBidButton({ existingBid, onClick, loading }: Props) {
  const isMobile = useIsMobile();
  const placedBidActive = existingBid && existingBid?.status !== "Rejected";
  const bidTime =
    existingBid?.createdAt && formatRelativeTime(existingBid.createdAt);

  const sx: SxProps<Theme> = isMobile
    ? { borderRadius: 0, position: "sticky", bottom: 0, zIndex: 1 }
    : { ml: 1, minWidth: 190 };

  return (
    <Button
      variant={placedBidActive && !isMobile ? "outlined" : "contained"}
      color={placedBidActive ? "info" : "primary"}
      size={isMobile ? "large" : "small"}
      endIcon={<ChevronRight />}
      onClick={onClick}
      sx={sx}
      disabled={loading}
      fullWidth={isMobile}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : placedBidActive ? (
        `Bid Placed ${bidTime} Ago`
      ) : (
        "Bid This Job"
      )}
    </Button>
  );
}
