import {
  Button,
  Card,
  CircularProgress,
  Modal,
  SxProps,
  Theme,
  alpha,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import Text from "./Text";

interface Props {
  open: boolean;
  onClose: (close: boolean) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}
export default function DeleteModal({
  open,
  onClose,
  onDelete,
  loading,
}: Props) {
  const theme = useTheme();
  const iconBgColor = alpha(theme.palette.error.main, 0.2);

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Card sx={style}>
        <DeleteIcon
          color="error"
          sx={{
            p: 1,
            width: 80,
            height: 80,
            backgroundColor: iconBgColor,
            borderRadius: 15,
            mb: 1,
          }}
        />
        <Text type="subtitle">Are you sure you want to delete this?</Text>
        <Text sx={{ mb: 4, mt: 1 }}>This action cannot be undone.</Text>
        <Button
          color="error"
          variant="contained"
          fullWidth
          onClick={onDelete}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress color="inherit" size={23} />
            ) : (
              <DeleteIcon />
            )
          }
        >
          Yes, Delete Permanently
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={(e) => {
            e.stopPropagation(), onClose(false);
          }}
          sx={{ mt: 2 }}
        >
          Cancel
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
