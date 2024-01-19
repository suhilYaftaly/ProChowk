import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
  SwipeableDrawer,
  TextField,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import { ChangeEvent, useState } from "react";
import { LocationOn } from "@mui/icons-material";
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";

import { IJob } from "@gqlOps/job";
import { usePlaceBid } from "@gqlOps/jobBid";
import Text from "@reusable/Text";
import { charsCount } from "@/utils/utilFuncs";
import { agreementTxt } from "@/config/data";
import BidDateRange from "./BidDateRange";

type Props = {
  job: IJob;
  openDrawer: boolean;
  onDrawerClose: () => void;
  onDrawerOpen: () => void;
  contractorId: string;
  contactorLoading: boolean;
};
export default function JobBidDrawer({
  job,
  openDrawer,
  onDrawerClose,
  onDrawerOpen,
  contractorId,
  contactorLoading,
}: Props) {
  const theme = useTheme();
  const lightC = theme.palette.text.light;
  /**padding */
  const p = 2;
  const { placeBidAsync, loading: bidLoading } = usePlaceBid();
  const [form, setForm] = useState<TForm>({
    quote: 200,
    startDate: "",
    endDate: "",
    proposal: "",
    agreementAccepted: false,
  });
  const [errors, setErrors] = useState<TErrors>({
    quote: "",
    startDate: "",
    endDate: "",
    proposal: "",
    agreementAccepted: "",
  });
  const loading = bidLoading || contactorLoading;
  const disableSubmit = loading || !form.agreementAccepted;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateErrors({ form, setErrors });
    if (error) return;

    placeBidAsync({
      variables: { input: { contractorId, jobId: job.id, ...form } },
      onSuccess: () => {
        toast.success("Bid placed successfully.", {
          position: "bottom-right",
        });
        onDrawerClose();
      },
    });
  };

  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onNumberValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value === "" ? "" : Number(value);

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAgreementCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setForm((prev) => ({ ...prev, agreementAccepted: checked }));
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={openDrawer}
      onClose={onDrawerClose}
      onOpen={onDrawerOpen}
    >
      <Stack
        component={"form"}
        onSubmit={onSubmit}
        sx={{ justifyContent: "space-between", flex: 1, width: 320 }}
      >
        <Stack>
          <Stack sx={{ p }}>
            <Text type="subtitle">{job.title}</Text>
            <Stack direction={"row"} sx={{ alignItems: "center", mt: 0.5 }}>
              {job?.address?.city && (
                <>
                  <LocationOn
                    sx={{ color: lightC, width: 20, height: 20, mr: 1 }}
                  />
                  <Text sx={{ color: lightC }}>
                    {job?.address?.city}, {job?.address?.stateCode}
                  </Text>
                </>
              )}
            </Stack>
          </Stack>
          <Divider />
          <Stack sx={{ p }}>
            <Text sx={{ mb: 1, fontWeight: 500 }}>Bid Quote*</Text>
            <TextField
              variant="outlined"
              size="small"
              name={"quote"}
              value={form.quote}
              type="number"
              onChange={onNumberValueChange}
              error={Boolean(errors.quote)}
              helperText={errors.quote}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              inputProps={{ min: configs.minQuote }}
            />
            <BidDateRange
              startDate={form.startDate}
              endDate={form.endDate}
              setStartDate={(startDate) =>
                setForm((prev) => ({ ...prev, startDate }))
              }
              setEndDate={(endDate) =>
                setForm((prev) => ({ ...prev, endDate }))
              }
              startDateErrTxt={errors.startDate}
              endDateErrTxt={errors.endDate}
            />
            <Text sx={{ mb: 1, fontWeight: 500 }}>
              Proposal ${charsCount(form.proposal, configs.maxProposal)}
            </Text>
            <TextField
              variant="outlined"
              size="small"
              name={"proposal"}
              value={form.proposal}
              onChange={onValueChange}
              placeholder={proposalPlaceholder}
              error={Boolean(errors.proposal)}
              helperText={errors.proposal}
              multiline
              rows={4}
              inputProps={{ maxLength: configs.maxProposal }}
              sx={{ mb: 2 }}
            />
            <Text sx={{ mb: 1, fontWeight: 500 }}>Agreement*</Text>
            <Text>{agreementTxt}</Text>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.agreementAccepted}
                    onChange={handleAgreementCheck}
                  />
                }
                label="I agree with this"
                sx={{ color: theme.palette.primary.main }}
              />
              {errors.agreementAccepted && (
                <Text type="caption" cColor="error" sx={{ ml: 1 }}>
                  {errors.agreementAccepted}
                </Text>
              )}
            </FormGroup>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          type="submit"
          sx={{ borderRadius: 0 }}
          size="large"
          disabled={disableSubmit}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Submit Your Bid"
          )}
        </Button>
      </Stack>
    </SwipeableDrawer>
  );
}

const configs = { minQuote: 14, maxProposal: 350, minProposal: 5 };

const proposalPlaceholder =
  "Describe your approach to the job, including key steps, materials, and timelines. Highlight your unique strengths or past experience relevant to this project.";

type TErrors = {
  quote: string;
  startDate: string;
  endDate: string;
  proposal: string;
  agreementAccepted: string;
};
type TForm = {
  quote: number;
  startDate: string;
  endDate: string;
  proposal: string;
  agreementAccepted: boolean;
};

type TValidateErrors = {
  form: TForm;
  setErrors: React.Dispatch<React.SetStateAction<TErrors>>;
};
const validateErrors = ({ form, setErrors }: TValidateErrors) => {
  let hasError = false;
  const errors: TErrors = {
    quote: "",
    startDate: "",
    endDate: "",
    proposal: "",
    agreementAccepted: "",
  };

  if (form.quote < configs.minQuote) {
    errors.quote = `Bid Quote must be more than ${configs.minQuote}.`;
    hasError = true;
  }

  const startDate = startOfDay(parseISO(form.startDate));
  const today = startOfDay(new Date());
  if (isBefore(startDate, today)) {
    errors.startDate = "Start date must be today or in the future.";
    hasError = true;
  }
  if (form.endDate && !form.startDate) {
    errors.endDate = "Start date must selected if end is selected";
    hasError = true;
  }
  if (form.startDate && form.endDate) {
    if (!isAfter(parseISO(form.endDate), parseISO(form.startDate))) {
      errors.endDate = "End date must be after start date.";
      hasError = true;
    }
  }

  if (form.proposal && form.proposal.length < configs.minProposal) {
    errors.proposal = `Proposal must be more than ${configs.minProposal} characters.`;
    hasError = true;
  }

  if (!form.agreementAccepted) {
    errors.agreementAccepted = "Agreement must be accepted.";
    hasError = true;
  }

  setErrors(errors);
  return hasError;
};
