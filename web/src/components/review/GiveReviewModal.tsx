import { useState } from "react";
import {
  Button,
  CircularProgress,
  Rating,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";

import CustomModal from "../reusable/CustomModal";
import { useSubmitReview } from "@gqlOps/review";
import { useUserStates } from "@/redux/reduxStates";

type Props = {
  open: boolean;
  onClose: (close: boolean) => void;
  reviewedId: string;
};
export default function GiveReviewModal({ open, onClose, reviewedId }: Props) {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const { userId } = useUserStates();
  const [form, setForm] = useState({ rating: 4, comment: "" });
  const { submitReviewAsync, loading } = useSubmitReview();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      submitReviewAsync({
        variables: { reviewerId: userId, reviewedId, ...form },
        onSuccess: () => {
          toast.success("Review successfully submitted.", {
            position: "bottom-right",
          });
          onClose(false);
        },
      });
    }
  };

  return (
    <CustomModal
      title="Give Review"
      open={open}
      onClose={onClose}
      disableBGClose
    >
      <Stack component={"form"} onSubmit={onSubmit}>
        <Rating
          name="user-rating"
          value={form.rating}
          onChange={(_, newValue) =>
            setForm((prev) => ({ ...prev, rating: newValue || 0 }))
          }
          sx={{ alignSelf: "center", color: primaryC }}
          size="large"
        />
        <TextField
          label={"Comment"}
          variant="outlined"
          size="small"
          value={form.comment}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, comment: e.target.value }))
          }
          placeholder={"Share your experience... What did you like or dislike?"}
          multiline
          rows={4}
          sx={{ my: 3 }}
        />
        <Button variant="contained" type="submit" sx={{ mb: 1 }}>
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            "Submit Review"
          )}
        </Button>
      </Stack>
    </CustomModal>
  );
}
