import { Stack, useTheme } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import Text from "@reusable/Text";

interface Props {
  title: string;
  subtitle: string;
  currentStepNum: number;
  totalSteps: number;
  onClick: () => void;
}
export default function MJobNav({
  title,
  subtitle,
  currentStepNum,
  totalSteps,
  onClick,
}: Props) {
  const theme = useTheme();
  const darkTxtC = theme.palette.text.dark;
  const whiteC = theme.palette.common.white;

  return (
    <div onClick={onClick}>
      <Stack
        direction={"row"}
        sx={{
          backgroundColor: darkTxtC,
          alignItems: "center",
          color: whiteC,
          p: 1,
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <KeyboardArrowLeftIcon sx={{ height: 30, width: 30 }} />
          <Stack sx={{ ml: 2 }}>
            <Text type="subtitle" sx={{ color: "inherit", fontWeight: 600 }}>
              {title}
            </Text>
            {subtitle && (
              <Text sx={{ color: "inherit", fontWeight: 350 }}>
                Next: {subtitle}
              </Text>
            )}
          </Stack>
        </Stack>
        <Stack
          sx={{
            backgroundColor: whiteC,
            color: darkTxtC,
            borderRadius: 15,
            p: 1.5,
            mr: 1,
          }}
        >
          <Text sx={{ fontWeight: 1000, color: "inherit" }}>
            {currentStepNum}/{totalSteps}
          </Text>
        </Stack>
      </Stack>
    </div>
  );
}
