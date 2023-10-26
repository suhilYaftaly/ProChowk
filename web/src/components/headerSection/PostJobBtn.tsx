import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, SxProps, Theme } from "@mui/material";

import { setOpenJobPost } from "@rSlices/globalModalsSlice";
import { useAppDispatch } from "@/utils/hooks/hooks";

interface Props {
  onSubmit?: () => void;
  sx?: SxProps<Theme>;
}
export default function PostJobBtn({ onSubmit, sx }: Props) {
  const dispatch = useAppDispatch();
  const onPostJob = () => {
    dispatch(setOpenJobPost(true));
    onSubmit && onSubmit();
  };

  return (
    <Button
      variant="contained"
      endIcon={<ChevronRightIcon />}
      onClick={onPostJob}
      size="large"
      fullWidth
      sx={sx}
    >
      Post A Job
    </Button>
  );
}
