import { Button, CircularProgress, Stack } from "@mui/material";

import { useAcceptBid } from "@gqlOps/jobBid";
import Text from "@reusable/Text";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { setShowHiredModal } from "@/redux/slices/bidSlice";

type Props = {
  bidId: string;
  onReject: () => void;
  onAcceptSuccess: () => void;
};
export default function BidActionControl({
  bidId,
  onReject,
  onAcceptSuccess,
}: Props) {
  const dispatch = useAppDispatch();
  const { acceptBidAsync, loading } = useAcceptBid();

  const acceptTheBid = () => {
    acceptBidAsync({
      variables: { bidId },
      onSuccess: onDrawerClose,
    });
  };

  const onDrawerClose = () => {
    dispatch(setShowHiredModal(true));
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
    </>
  );
}
