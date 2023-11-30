import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

import JobPostPerson from "@icons/jobPostPerson.svg?react";
import Text from "@reusable/Text";
import { IJobPost } from "@/pages/JobPost";
import { useIsMobile } from "@/utils/hooks/hooks";

interface Props {
  children: ReactNode;
  steps: IJobPost["step"][];
  stepIndex: number;
  onNext: () => void;
  onBack: () => void;
  showLeftCont: boolean;
  nextBtnTitle?: string;
  loading: boolean;
}
export default function JobContainer({
  children,
  steps,
  stepIndex,
  onNext,
  onBack,
  showLeftCont,
  nextBtnTitle,
  loading,
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const palette = theme.palette;
  const prevStep = stepIndex > 0 && steps[stepIndex - 1];
  const nextStep = steps[stepIndex + 1];

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: 550,
        alignSelf: "center",
        width: "100%",
      }}
    >
      {!isMobile && showLeftCont && (
        <Stack
          sx={{
            backgroundColor: palette.secondary.dark,
            width: 250,
            px: 2,
            pt: 2,
            justifyContent: "space-between",
          }}
        >
          <Stack>
            <Text type="subtitle" sx={{ color: palette.common.white }}>
              Post a new job
            </Text>
            <Text sx={{ mb: 4, mt: 1, color: palette.grey[400] }}>
              Job size and location will help your job post standout to the
              right candidate.
            </Text>
          </Stack>
          <JobPostPerson style={{ alignSelf: "center" }} />
        </Stack>
      )}
      <Stack sx={{ p: 2, flex: 1, justifyContent: "space-between" }}>
        <Stack>{children}</Stack>
        <Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            {prevStep ? (
              <Button
                variant="outlined"
                sx={{ borderRadius: 5 }}
                onClick={onBack}
              >
                {prevStep?.label}
              </Button>
            ) : (
              <div></div>
            )}
            <Button
              variant="contained"
              sx={{ borderRadius: 5 }}
              onClick={onNext}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={25} color="primary" />
              ) : (
                nextBtnTitle || nextStep?.label
              )}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
