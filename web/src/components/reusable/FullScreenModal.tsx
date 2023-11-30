import { ReactNode, useEffect } from "react";
import { Stack, Box, Modal, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AppLogo from "./AppLogo";
import Text from "./Text";
import { maxWidthPG } from "@/config/configConst";

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
  const theme = useTheme();
  const headerBGColor = theme.palette.secondary.dark;
  const whiteColor = theme.palette.common.white;

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
        <Stack
          sx={{ backgroundColor: headerBGColor, p: 1, alignItems: "center" }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: maxWidthPG,
              width: "100%",
            }}
          >
            <AppLogo type="text" />
            <Text type="title" sx={{ color: whiteColor, textAlign: "center" }}>
              {title}
            </Text>
            <IconButton onClick={handleClose} sx={{ color: whiteColor }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Box sx={{ overflow: "auto", maxHeight: "calc(100% - 70px)", p: 1 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
