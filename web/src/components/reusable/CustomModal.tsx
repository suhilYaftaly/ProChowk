import {
  Modal,
  Stack,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { styled, useTheme } from "@mui/system";
import { maxWidthPG } from "@/config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  children: ReactNode;
  title: string;
}

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 350,
  maxWidth: maxWidthPG,
  maxHeight: "95%",
  backgroundColor: theme.palette.background.paper, // Set the background color based on the theme
  padding: theme.spacing(1),
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
}));

const ContentContainer = styled(Box)({
  overflowY: "auto",
});

export default function CustomModal({ open, onClose, children, title }: Props) {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <ModalContainer theme={theme} sx={{ minWidth: useRespVal(370, 600) }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{title}</Typography>
          <IconButton onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <ContentContainer>{children}</ContentContainer>
      </ModalContainer>
    </Modal>
  );
}
