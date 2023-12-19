import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, SxProps, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { paths } from "@/routes/Routes";

interface Props {
  onSubmit?: () => void;
  sx?: SxProps<Theme>;
}
export default function PostJobBtn({ onSubmit, sx }: Props) {
  const navigate = useNavigate();
  const onPostJob = () => {
    navigate(paths.jobPost);
    onSubmit && onSubmit();
  };

  return (
    <Button
      variant="contained"
      endIcon={<ChevronRightIcon />}
      onClick={onPostJob}
      fullWidth
      sx={sx}
    >
      Post A Job
    </Button>
  );
}
