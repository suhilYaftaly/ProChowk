import { Snackbar, Alert } from "@mui/material";

interface Props {
  open: boolean;
  handleClose: (close: boolean) => void;
  errMsg: string | undefined;
  duration?: number;
}

export default function ErrSnackbar({
  open,
  handleClose,
  errMsg,
  duration = 3000,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={() => handleClose(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => handleClose(false)}
        severity="error"
        color="error"
        sx={{ width: "100%" }}
      >
        {errMsg}
      </Alert>
    </Snackbar>
  );
}
