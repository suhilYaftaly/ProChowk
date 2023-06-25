import { ReactNode, useEffect } from "react";
import { Stack, Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppLogo from "./AppLogo";

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

  //back button should close modal only
  useEffect(() => {
    if (open) window.history.pushState(null, "", window.location.href);
    const handlePopstate = () => (open ? handleClose() : window.history.go(-1));
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [open]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={handleClose}
      disableEnforceFocus
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
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <AppLogo />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {title}
              </Typography>
            </Stack>
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
        <Box sx={{ overflow: "auto", maxHeight: "calc(100% - 70px)", p: 1 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
