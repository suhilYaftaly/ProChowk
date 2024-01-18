import { Button, Card, Modal, SxProps, Theme } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

import Text from "@reusable/Text";
import { IUser } from "@gqlOps/user";
import ChatWithUserCard from "@chat/ChatWithUserCard";

interface Props {
  open: boolean;
  onClose: (close: boolean) => void;
  bidder: IUser | undefined;
}
export default function BidAcceptedModal({ open, onClose, bidder }: Props) {
  const firstName = bidder?.name?.split(" ")?.[0];

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Card sx={style}>
        <CheckCircle color="success" sx={{ width: 50, height: 50 }} />
        <Text type="subtitle" cColor="primary">
          Congratulation!
        </Text>
        <Text type="subtitle" sx={{ mt: 0.5 }}>
          You hired {bidder?.name}
        </Text>
        <Text sx={{ my: 2 }}>Start Conversation with {firstName}</Text>
        {bidder && <ChatWithUserCard user={bidder} />}
        <Button
          variant="contained"
          onClick={() => onClose(false)}
          sx={{ mt: 3, minWidth: 150 }}
        >
          Okay
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
  width: 400,
  p: 4,
  textAlign: "center",
} as SxProps<Theme>;
