import { Button, Card, Modal, SxProps, Theme } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

import Text from "@reusable/Text";
import { IUser } from "@gqlOps/user";
import ChatWithUserCard from "@chat/ChatWithUserCard";

interface Props {
  open: boolean;
  onClose: (close: boolean) => void;
  poster: IUser | undefined;
}
export default function BidAcceptedModal({ open, onClose, poster }: Props) {
  const firstName = poster?.name?.split(" ")?.[0];

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Card sx={style}>
        <CheckCircle color="success" sx={{ width: 50, height: 50 }} />
        <Text type="subtitle" cColor="primary">
          Congratulation!
        </Text>
        <Text type="subtitle" sx={{ mt: 0.5 }}>
          You hired {poster?.name}
        </Text>
        <Text sx={{ my: 2 }}>Start Conversation with {firstName}</Text>
        {poster && <ChatWithUserCard user={poster} />}
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
