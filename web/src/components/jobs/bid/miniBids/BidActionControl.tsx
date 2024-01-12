import { Button, CircularProgress, Stack } from "@mui/material";
import { useState } from "react";

import { useAcceptBid } from "@gqlOps/jobBid";
import Text from "@reusable/Text";
import BidAcceptedModal from "./BidAcceptedModal";
import { IUser } from "@gqlOps/user";

type Props = {
  bidId: string;
  onReject: () => void;
  onAcceptSuccess: () => void;
  poster: IUser | undefined;
};
export default function BidActionControl({
  bidId,
  onReject,
  onAcceptSuccess,
  poster,
}: Props) {
  const { acceptBidAsync, loading } = useAcceptBid();
  const [openModal, setOpenModal] = useState(false);

  const acceptTheBid = () => {
    acceptBidAsync({
      variables: { bidId },
      onSuccess: () => setOpenModal(true),
    });
  };

  const onDrawerClose = () => {
    setOpenModal(false);
    onAcceptSuccess();
  };

  return (
    <>
      <Stack spacing={2} sx={{ alignItems: "center", p: 2 }}>
        <Text type="subtitle">Do you want to accept this bid?</Text>
        <Button
          variant="contained"
          color="success"
          onClick={acceptTheBid}
          fullWidth
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Yes, Hire"
          )}
        </Button>
        <Button variant="contained" onClick={onReject} fullWidth>
          Not Interested
        </Button>
      </Stack>
      <BidAcceptedModal
        open={openModal}
        onClose={onDrawerClose}
        poster={poster}
      />
    </>
  );
}
