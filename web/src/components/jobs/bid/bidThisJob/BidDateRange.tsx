import { IconButton, Stack } from "@mui/material";
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
export default function BidDateRange({
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
    <>
      <Stack direction={"row"} alignItems={"center"} sx={{ mb: 1 }}>
        <Text sx={{ fontWeight: 500 }}>Start Date</Text>
        {isMobile && (
          <IconButton onClick={() => setStartDate("")} size="small">
            <RefreshIcon />
          </IconButton>
        )}
      </Stack>
      <DatePicker
        value={startDate ? parseISO(startDate) : null}
        onChange={handleStartDateChange}
        disablePast
        sx={{ mb: 2 }}
        slotProps={{
          field: {
            clearable: true,
            onClear: () => setStartDate(""),
          },
          textField: {
            helperText: startDateErrTxt,
            error: Boolean(startDateErrTxt),
            size: "small",
          },
        }}
      />
      <Stack direction={"row"} alignItems={"center"} sx={{ mb: 1 }}>
        <Text sx={{ fontWeight: 500 }}>End Date</Text>
        {isMobile && (
          <IconButton onClick={() => setStartDate("")} size="small">
            <RefreshIcon />
          </IconButton>
        )}
      </Stack>
      <DatePicker
        value={endDate ? parseISO(endDate) : null}
        onChange={handleEndDateChange}
        disablePast
        minDate={startDate ? parseISO(startDate) : undefined}
        sx={{ mb: 2 }}
        slotProps={{
          field: {
            clearable: true,
            onClear: () => setEndDate(""),
          },
          textField: {
            helperText: endDateErrTxt,
            error: Boolean(endDateErrTxt),
            size: "small",
          },
        }}
      />
    </>
  );
}
