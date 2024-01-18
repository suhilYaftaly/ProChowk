import { Modal, Stack, IconButton, Box, Divider, styled } from "@mui/material";
import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { maxWidthPG } from "@/config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";
import Text from "./Text";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  children: ReactNode;
  title: string;
  /**close on background click? @default false */
  disableBGClose?: boolean;
}

export default function CustomModal({
  open,
  onClose,
  children,
  title,
  disableBGClose = false,
}: Props) {
  return (
    <Modal open={open} onClose={() => !disableBGClose && onClose(false)}>
      <ModalContainer sx={{ minWidth: useRespVal(370, 600) }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Text type="title">{title}</Text>
          <IconButton onClick={() => onClose(false)}>
            <CloseIcon color="primary" />
          </IconButton>
        </Stack>
        <Divider />
        <ContentContainer>{children}</ContentContainer>
      </ModalContainer>
    </Modal>
  );
}

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: maxWidthPG,
  maxHeight: "95%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  padding: theme.spacing(2),
}));
