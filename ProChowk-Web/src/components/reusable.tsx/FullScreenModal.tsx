import { ReactNode } from "react";
import { Stack, Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onClose?: () => void;
}

export default function FullScreenModal({
  open,
  setOpen,
  title,
  children,
  onClose,
}: Props) {
  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          height: "100%",
          width: "100%",
        }}
      >
        <Box boxShadow={1} padding={1}>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
        <Box padding={1}>{children}</Box>
      </Box>
    </Modal>
  );
}
