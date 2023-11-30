import { Tabs, Tab, Stack, useTheme } from "@mui/material";
import { ReactNode } from "react";

import { maxWidthPG } from "@/config/configConst";
import { IJobPost } from "@/pages/JobPost";

interface Props {
  children?: ReactNode;
  steps: IJobPost["step"][];
  stepIndex: number;
  onChange: (index: number) => void;
}
export default function JobNav({
  children,
  steps,
  stepIndex,
  onChange,
}: Props) {
  const theme = useTheme();
  const bgColor = theme.palette.background.paper;
  return (
    <Stack sx={{ backgroundColor: bgColor, alignItems: "center" }}>
      <Stack
        direction={"row"}
        sx={{
          maxWidth: maxWidthPG,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          variant="scrollable"
          value={stepIndex}
          onChange={(_, i) => onChange(i)}
        >
          {steps.map((step) => (
            <Tab key={step.label} label={step.label} />
          ))}
        </Tabs>
        {children}
      </Stack>
    </Stack>
  );
}
