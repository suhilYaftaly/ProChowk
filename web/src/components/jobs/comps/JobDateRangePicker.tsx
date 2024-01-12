import { IconButton, Stack, SxProps, Theme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import RefreshIcon from "@mui/icons-material/Refresh";

import Text from "@reusable/Text";
import { useIsMobile } from "@hooks/hooks";

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
  const isMobile = useIsMobile();
  const handleStartDateChange = (date: Date | null) => {
    if (date && !isNaN(date.getTime()))
      setStartDate(startOfDay(date).toISOString());
  };
  const handleEndDateChange = (date: Date | null) => {
    if (date && !isNaN(date.getTime()))
      setEndDate(endOfDay(date).toISOString());
  };

  return (
    <Stack spacing={2} direction={"row"}>
      <Stack sx={{ width: "100%" }}>
        <Stack direction={"row"} alignItems={"center"}>
          <Text>Start Date</Text>
          {isMobile && (
            <IconButton onClick={() => setStartDate("")} size="small">
              <RefreshIcon />
            </IconButton>
          )}
        </Stack>
        <DatePicker
          value={startDate ? parseISO(startDate) : null}
          onChange={handleStartDateChange}
          sx={datePickerSX}
          disablePast
          slotProps={{
            field: { clearable: true, onClear: () => setStartDate("") },
            textField: {
              helperText: startDateErrTxt,
              error: Boolean(startDateErrTxt),
              size: "small",
            },
          }}
        />
      </Stack>
      <Stack sx={{ width: "100%" }}>
        <Stack direction={"row"} alignItems={"center"}>
          <Text>End Date</Text>
          {isMobile && (
            <IconButton onClick={() => setEndDate("")} size="small">
              <RefreshIcon />
            </IconButton>
          )}
        </Stack>
        <DatePicker
          value={endDate ? parseISO(endDate) : null}
          onChange={handleEndDateChange}
          sx={datePickerSX}
          disablePast
          minDate={startDate ? parseISO(startDate) : undefined}
          slotProps={{
            field: { clearable: true, onClear: () => setEndDate("") },
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
