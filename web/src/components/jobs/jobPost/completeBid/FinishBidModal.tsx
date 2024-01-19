import {
  Button,
  Card,
  CircularProgress,
  Modal,
  SxProps,
  Theme,
} from "@mui/material";

import Text from "@reusable/Text";

type Props = {
  open: boolean;
  onClose: (close: boolean) => void;
  onAccept: () => void;
  loading: boolean;
};
export default function FinishBidModal({
  open,
  onClose,
  onAccept,
  loading,
}: Props) {
  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Card sx={style}>
        <Text type="subtitle" sx={{ mb: 1 }}>
          Do you want to finish this bid?
        </Text>
        <Text sx={{ mb: 3 }}>This bid will be marked as completed.</Text>
        <Button
          variant="contained"
          color="success"
          onClick={onAccept}
          sx={{ mr: 1, minWidth: 100 }}
        >
          {loading ? <CircularProgress color="inherit" size={24} /> : "Yes"}
        </Button>
        <Button
          variant="contained"
          onClick={() => onClose(false)}
          sx={{ minWidth: 100 }}
        >
          No
        </Button>
      </Card>
    </Modal>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  p: 4,
  textAlign: "center",
} as SxProps<Theme>;
