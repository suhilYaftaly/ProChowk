import { ChangeEvent, useState, useEffect } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Stack,
} from "@mui/material";
import { formatISO, subHours, subDays, subMonths } from "date-fns";

import Text from "@reusable/Text";

const DayPostedOptions = [
  "24 Hr",
  "This Week",
  "This Month",
  "More than 1 month",
];

export interface IDateRange {
  startDate?: string;
  endDate?: string;
}
interface Props {
  onDateChange: ({ startDate, endDate }: IDateRange) => void;
  selectedIndex?: number;
}
export default function DayPosted({ onDateChange, selectedIndex }: Props) {
  const theme = useTheme();
  const darkTxColor = theme.palette.text.dark;
  const [selectedOption, setSelectedOption] = useState(
    DayPostedOptions[selectedIndex ?? 0]
  );

  useEffect(() => {
    const { startDate, endDate } = getDateRange();
    onDateChange({ startDate, endDate });
  }, [selectedOption]);

  useEffect(() => {
    if (selectedIndex != undefined) {
      setSelectedOption(DayPostedOptions[selectedIndex]);
    }
  }, [selectedIndex]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const getDateRange = () => {
    const now = new Date();
    switch (selectedOption) {
      case "24 Hr":
        return {
          startDate: formatISO(subHours(now, 24)),
          endDate: formatISO(now),
        };
      case "This Week":
        return {
          startDate: formatISO(subDays(now, 7)),
          endDate: formatISO(now),
        };
      case "This Month":
        return {
          startDate: formatISO(subMonths(now, 1)),
          endDate: formatISO(now),
        };
      case "More than 1 month":
      default:
        return { startDate: undefined, endDate: undefined };
    }
  };

  return (
    <Stack sx={{ px: 2 }}>
      <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
        Day Posted
      </Text>
      <FormControl>
        <RadioGroup value={selectedOption} onChange={handleChange}>
          {DayPostedOptions.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
              componentsProps={{
                typography: {
                  color: darkTxColor,
                  fontWeight: selectedOption === option ? "600" : undefined,
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}
