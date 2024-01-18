import { Button, CircularProgress, SxProps, Theme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import { useIsMobile } from "@/utils/hooks/hooks";
import FinishJobModal from "./FinishJobModal";
import { useUpdateJobStatus } from "@gqlOps/job";

type Props = { jobId: string; onSuccess: () => void };
export default function CompleteJobBtn({ jobId, onSuccess }: Props) {
  const isMobile = useIsMobile();
  const [openFinish, setOpenFinish] = useState(false);

  const { updateJobStatusAsync, loading } = useUpdateJobStatus();

  const onFinishJob = () => {
    updateJobStatusAsync({
      variables: { jobId, status: "Completed" },
      onSuccess: () => {
        toast.success("Job completed successfully.", {
          position: "bottom-right",
        });
        setOpenFinish(false);
        onSuccess();
      },
    });
  };

  const sx: SxProps<Theme> = isMobile
    ? { borderRadius: 0, position: "sticky", bottom: 0, zIndex: 1 }
    : { ml: 1 };

  return (
    <>
      <Button
        variant="contained"
        size={isMobile ? "large" : "small"}
        onClick={() => setOpenFinish(true)}
        sx={sx}
        fullWidth={isMobile}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          "Finish this job"
        )}
      </Button>
      <FinishJobModal
        open={openFinish}
        onClose={setOpenFinish}
        onAccept={onFinishJob}
        loading={loading}
      />
    </>
  );
}
