import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import Text from "@reusable/Text";
import { useRejectBid } from "@gqlOps/jobBid";

type Props = { bidId: string; onSuccess: () => void; onGoBack: () => void };
export default function BidRejectForm({ bidId, onSuccess, onGoBack }: Props) {
  const theme = useTheme();
  const darkTxColor = theme.palette.text.dark;
  const { rejectBidAsync, loading } = useRejectBid();
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [errors, setErrors] = useState({ otherReason: "" });

  const isOtherReasonActive = selectedReason === "Other";

  const onSubmit = () => {
    const error = validateFileds();
    if (error) return;

    const rejectionReason = isOtherReasonActive ? otherReason : selectedReason;
    rejectBidAsync({
      variables: { bidId, rejectionReason },
      onSuccess: () => {
        toast.success("Bid Rejected Successfully.", {
          position: "bottom-right",
        });
        onSuccess();
      },
    });
  };

  const validateFileds = () => {
    let hasErrors = false;
    let errs = { otherReason: "" };
    if (isOtherReasonActive && otherReason?.length < configs.minOtherReason) {
      errs.otherReason = `Must be more than ${configs.minOtherReason} characters.`;
      hasErrors = true;
    }

    setErrors(errs);
    return hasErrors;
  };

  return (
    <Stack>
      <Text type="subtitle" sx={{ mb: 0.5 }}>
        Select the reason for rejection.
      </Text>
      <FormControl>
        <RadioGroup
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          {reasons.map((reason) => {
            const isChecked = selectedReason === reason;
            return (
              <FormControlLabel
                key={reason}
                value={reason}
                control={<Radio />}
                label={reason}
                componentsProps={{
                  typography: {
                    color: darkTxColor,
                    fontWeight: isChecked ? "600" : undefined,
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <TextField
        label="Describe the reason"
        variant="outlined"
        size="small"
        value={otherReason}
        onChange={(e) => setOtherReason(e.target.value)}
        error={Boolean(errors.otherReason)}
        helperText={errors.otherReason}
        multiline
        rows={4}
        inputProps={{ maxLength: configs.maxOtherReason }}
        disabled={!isOtherReasonActive}
        sx={{ mt: 2 }}
      />
      <Divider sx={{ my: 3 }} />
      <Button variant="contained" onClick={onSubmit}>
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Submit Now"
        )}
      </Button>
      <Button onClick={onGoBack} color="inherit" sx={{ mt: 1 }}>
        Cancel & Go Back To Bid
      </Button>
    </Stack>
  );
}

const reasons = [
  "Price",
  "Lead Time",
  "Not Professional",
  "Don't match with required skills",
  "Other",
];

const configs = { maxOtherReason: 350, minOtherReason: 5 };
