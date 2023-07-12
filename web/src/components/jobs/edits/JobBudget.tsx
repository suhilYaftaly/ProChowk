import {
  Box,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import TimeIcon from "@mui/icons-material/AccessTime";
import MoneyIcon from "@mui/icons-material/MonetizationOnOutlined";
import CheckIcon from "@mui/icons-material/CheckCircle";
import UncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { IJob, IJobError } from "./PostAJob";

interface Props {
  job: IJob;
  setJob: Dispatch<SetStateAction<IJob>>;
  errors: IJobError;
}

export default function JobBudget({ job, setJob, errors }: Props) {
  const onTypeSelect = (type: IJob["budget"]["type"]) => {
    setJob((pv) => ({ ...pv, budget: { ...pv.budget, type } }));
  };
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJob({ ...job, budget: { ...job.budget, [name]: value } });
  };

  return (
    <Stack>
      <Stack direction={"row"} sx={{ justifyContent: "center", gap: 2 }}>
        <BudgetType
          job={job}
          type="Hourly"
          label="Hourly Rate"
          onTypeSelect={onTypeSelect}
        />
        <BudgetType
          job={job}
          type="Project"
          label="Project Budget"
          onTypeSelect={onTypeSelect}
        />
      </Stack>
      <Divider sx={{ my: 4 }} />
      <Stack spacing={2} direction={"row"}>
        <TextField
          label={"From"}
          variant="outlined"
          size="small"
          name={"from"}
          value={job?.budget?.from}
          type="number"
          onChange={onValueChange}
          placeholder={"From"}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          error={Boolean(errors.budgetFrom)}
          helperText={errors.budgetFrom}
        />
        <TextField
          label={"To"}
          variant="outlined"
          size="small"
          name={"to"}
          value={job?.budget?.to}
          type="number"
          onChange={onValueChange}
          placeholder={"To"}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          error={Boolean(errors.budgetTo)}
          helperText={errors.budgetTo}
        />
        {job?.budget?.type === "Hourly" && (
          <TextField
            label={"Max Hours"}
            variant="outlined"
            size="small"
            name={"maxHours"}
            value={job.budget.maxHours}
            type="number"
            onChange={onValueChange}
            placeholder={"Max hours"}
            error={Boolean(errors.budgetMaxHour)}
            helperText={errors.budgetMaxHour}
          />
        )}
      </Stack>
    </Stack>
  );
}

interface IBudgetType {
  job: IJob;
  type: IJob["budget"]["type"];
  onTypeSelect: (type: IJob["budget"]["type"]) => void;
  label: string;
}
const BudgetType = ({ job, type, onTypeSelect, label }: IBudgetType) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <SelectBox
      onClick={() => onTypeSelect(type)}
      sx={{ color: job.budget.type === type ? color : "inherit" }}
    >
      <Stack sx={{ alignItems: "flex-end", mb: 1 }}>
        {job.budget.type === type ? <CheckIcon /> : <UncheckedIcon />}
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        {type === "Hourly" ? <TimeIcon /> : <MoneyIcon />}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Stack>
    </SelectBox>
  );
};

const SelectBox = styled(Box)((theme) => ({
  "&:hover": {
    color: theme.theme.palette.secondary.main,
    cursor: "pointer",
  },
  border: "2px solid",
  padding: "10px 20px",
  borderRadius: 5,
}));
