import { ChangeEvent, useEffect, useState } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Stack,
} from "@mui/material";

import Text from "@reusable/Text";
import { BudgetType } from "@gqlOps/job";

const TypeOptions: TTypeOption[] = ["All", "Hourly", "Project"];

export type TTypeOption = "All" | "Hourly" | "Project";

interface Props {
  onTypesChange: (types: BudgetType[]) => void;
  index?: number;
}
export default function ProjectType({ onTypesChange, index }: Props) {
  const theme = useTheme();
  const darkTxColor = theme.palette.text.dark;
  const [selectedOption, setSelectedOption] = useState(TypeOptions[index ?? 0]);

  useEffect(() => {
    if (index != undefined) setSelectedOption(TypeOptions[index]);
  }, [index]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as TTypeOption;
    setSelectedOption(type);
    switch (type) {
      case "All":
        onTypesChange(["Hourly", "Project"]);
        break;
      case "Hourly":
        onTypesChange(["Hourly"]);
        break;
      case "Project":
        onTypesChange(["Project"]);
        break;
    }
  };

  return (
    <Stack sx={{ px: 2 }}>
      <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
        Project Type
      </Text>
      <FormControl>
        <RadioGroup value={selectedOption} onChange={handleChange}>
          {TypeOptions.map((option) => (
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
