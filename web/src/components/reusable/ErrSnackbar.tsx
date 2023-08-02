import { Snackbar, Alert, SnackbarProps } from "@mui/material";

interface Props {
  open: boolean;
  handleClose: (close: boolean) => void;
  errMsg: string | undefined;
  duration?: number;
  anchorOrigin?: SnackbarProps["anchorOrigin"];
}

export default function ErrSnackbar({
  open,
  handleClose,
  errMsg,
  duration = 3000,
  anchorOrigin = { vertical: "top", horizontal: "center" },
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={() => handleClose(false)}
      anchorOrigin={anchorOrigin}
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
