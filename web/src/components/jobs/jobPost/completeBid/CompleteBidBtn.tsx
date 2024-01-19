import { Button, CircularProgress, SxProps, Theme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import { useIsMobile } from "@/utils/hooks/hooks";
import FinishBidModal from "./FinishBidModal";
import { useCompleteBid } from "@gqlOps/jobBid";

type Props = { bidId: string; onSuccess: () => void };
export default function CompleteBidBtn({ bidId, onSuccess }: Props) {
  const isMobile = useIsMobile();
  const [openFinish, setOpenFinish] = useState(false);

  const { completeBidAsync, loading } = useCompleteBid();

  const onCompleteBid = () => {
    completeBidAsync({
      variables: { bidId },
      onSuccess: () => {
        toast.success("Bid completed successfully.", {
          position: "bottom-right",
        });
        setOpenFinish(false);
        onSuccess();
      },
    });
  };

  const sx: SxProps<Theme> = isMobile
    ? { borderRadius: 0, position: "sticky", bottom: 0, zIndex: 1 }
    : { ml: 1 };

  return (
    <>
      <Button
        variant="contained"
        size={isMobile ? "large" : "small"}
        onClick={() => setOpenFinish(true)}
        sx={sx}
        fullWidth={isMobile}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          "Finish this bid"
        )}
      </Button>
      <FinishBidModal
        open={openFinish}
        onClose={setOpenFinish}
        onAccept={onCompleteBid}
        loading={loading}
      />
    </>
  );
}
