import { SxProps, Theme } from "@mui/material";

export const iconCircleSX = (theme: Theme): SxProps<Theme> => ({
  border: "2px solid",
  padding: 0.5,
  borderRadius: 5,
  color: theme.palette.text.light,
  width: 30,
  height: 30,
});
