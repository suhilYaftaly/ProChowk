import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  styled,
  useTheme,
} from "@mui/material";
import { ChangeEvent } from "react";
import TimeIcon from "@mui/icons-material/AccessTime";
import MoneyIcon from "@mui/icons-material/MonetizationOnOutlined";
import CheckIcon from "@mui/icons-material/CheckCircle";
import UncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import Text from "@reusable/Text";
import { JobInput } from "@/graphql/operations/job";
import { jobConfigs } from "@/config/configConst";
import { useRespVal } from "@/utils/hooks/hooks";
import { IJobSteps } from "./JobForm";

export default function JobBudget({ jobForm, setJobForm, errors }: IJobSteps) {
  const resets = jobConfigs.defaults.budgetResets;
  const mb = 1;
  const mt = 3;

  const onTypeSelect = (type: JobInput["budget"]["type"]) => {
    setJobForm((prev) => {
      let values = { ...prev };

      if (type === "Hourly") {
        values.budget.from = resets.hourly.from;
        values.budget.to = resets.hourly.to;
      } else if (type === "Project") {
        values.budget.from = resets.project.from;
        values.budget.to = resets.project.to;
      }

      values.budget.type = type;

      return values;
    });
  };

  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const newValue = value === "" ? "" : Number(value);
    setJobForm((prev) => ({
      ...prev,
      budget: { ...prev.budget, [name]: newValue },
    }));
  };

  const isHourly = jobForm.budget.type === "Hourly";

  return (
    <>
      <Text type="subtitle" sx={{ mb }}>
        Select budget type
      </Text>
      <Stack direction={"row"} sx={{ gap: 2 }}>
        <BudgetType
          job={jobForm}
          type="Project"
          label="Project Budget"
          onTypeSelect={onTypeSelect}
        />
        <BudgetType
          job={jobForm}
          type="Hourly"
          label="Hourly Rate"
          onTypeSelect={onTypeSelect}
        />
      </Stack>
      <Stack direction={useRespVal("column", "row")}>
        <Stack sx={{ mr: 2, width: "100%" }}>
          <Text type="subtitle" sx={{ mb, mt }}>
            From
          </Text>
          <TextField
            variant="outlined"
            size="small"
            name={"from"}
            value={jobForm?.budget?.from}
            type="number"
            onChange={onValueChange}
            placeholder={"From"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              endAdornment: isHourly && (
                <InputAdornment position="end">/hour</InputAdornment>
              ),
            }}
            error={Boolean(errors.budget.from)}
            helperText={errors.budget.from}
            required
          />
        </Stack>
        <Stack sx={{ width: "100%" }}>
          <Text type="subtitle" sx={{ mb, mt }}>
            To
          </Text>
          <TextField
            variant="outlined"
            size="small"
            name={"to"}
            value={jobForm?.budget?.to}
            type="number"
            onChange={onValueChange}
            placeholder={"To"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              endAdornment: isHourly && (
                <InputAdornment position="end">/hour</InputAdornment>
              ),
            }}
            error={Boolean(errors.budget.to)}
            helperText={errors.budget.to}
            required
          />
        </Stack>
      </Stack>
      {isHourly && (
        <>
          <Text type="subtitle" sx={{ mb, mt }}>
            Max Hours
          </Text>
          <TextField
            variant="outlined"
            size="small"
            name={"maxHours"}
            value={jobForm.budget.maxHours}
            type="number"
            onChange={onValueChange}
            placeholder={"Max hours"}
            error={Boolean(errors.budget.maxHours)}
            helperText={errors.budget.maxHours}
            required
          />
        </>
      )}
    </>
  );
}

interface IBudgetType {
  job: JobInput;
  type: JobInput["budget"]["type"];
  onTypeSelect: (type: JobInput["budget"]["type"]) => void;
  label: string;
}
const BudgetType = ({ job, type, onTypeSelect, label }: IBudgetType) => {
  const theme = useTheme();
  const pColor = theme.palette.primary.main;
  const whiteColor = theme.palette.common.white;
  const isSelected = job.budget.type === type;
  const selectedTxtColor = isSelected ? whiteColor : "inherit";

  return (
    <SelectBox
      onClick={() => onTypeSelect(type)}
      sx={{
        color: isSelected ? pColor : "grey",
        backgroundColor: isSelected ? pColor : undefined,
      }}
    >
      <Stack direction={"row"} sx={{ justifyContent: "space-between", mb: 1 }}>
        {type === "Hourly" ? (
          <TimeIcon sx={{ color: selectedTxtColor, width: 30, height: 30 }} />
        ) : (
          <MoneyIcon sx={{ color: selectedTxtColor, width: 30, height: 30 }} />
        )}
        {isSelected ? (
          <CheckIcon sx={{ color: whiteColor }} />
        ) : (
          <UncheckedIcon sx={{ color: selectedTxtColor }} />
        )}
      </Stack>

      <Text type="subtitle" sx={{ color: selectedTxtColor }}>
        {label}
      </Text>
    </SelectBox>
  );
};

const SelectBox = styled(Box)(({ theme }) => {
  const mode = theme.palette.mode;
  const color =
    mode === "light"
      ? theme.palette.secondary.dark
      : theme.palette.primary.light;
  return {
    "&:hover": { color, cursor: "pointer" },
    border: "2px solid",
    padding: "10px 20px",
    borderRadius: 5,
  };
});
