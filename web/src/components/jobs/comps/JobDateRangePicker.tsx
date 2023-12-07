import { Stack, SxProps, Theme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { startOfDay, endOfDay, parseISO } from "date-fns";

import Text from "@reusable/Text";

interface Props {
  startDate?: string;
  setStartDate: (date: string) => void;
  endDate?: string;
  setEndDate: (date: string) => void;
  startDateErrTxt: string;
  endDateErrTxt: string;
}

/**The passed dates should be in ISO string format */
export default function JobDateRangePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startDateErrTxt,
  endDateErrTxt,
}: Props) {
  const handleStartDateChange = (date: Date | null) => {
    if (date) setStartDate(startOfDay(date).toISOString());
  };
  const handleEndDateChange = (date: Date | null) => {
    if (date) setEndDate(endOfDay(date).toISOString());
  };

  return (
    <Stack spacing={2} direction={"row"}>
      <Stack sx={{ width: "100%" }}>
        <Text>Start Date</Text>
        <DatePicker
          value={startDate ? parseISO(startDate) : null}
          onChange={handleStartDateChange}
          sx={datePickerSX}
          disablePast
          slotProps={{
            textField: {
              helperText: startDateErrTxt,
              error: Boolean(startDateErrTxt),
              size: "small",
            },
          }}
        />
      </Stack>
      <Stack sx={{ width: "100%" }}>
        <Text>End Date</Text>
        <DatePicker
          value={endDate ? parseISO(endDate) : null}
          onChange={handleEndDateChange}
          sx={datePickerSX}
          disablePast
          minDate={startDate ? parseISO(startDate) : undefined}
          slotProps={{
            textField: {
              helperText: endDateErrTxt,
              error: Boolean(endDateErrTxt),
              size: "small",
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

const datePickerSX: SxProps<Theme> = {
  width: "100%",
};
