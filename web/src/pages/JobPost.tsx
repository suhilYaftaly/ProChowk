import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { jobConfigs } from "@/config/configConst";
import { useUserStates } from "@/redux/reduxStates";
import { navigateToUserPage } from "@/utils/utilFuncs";
import { JobInput, useCreateJob, useUpdateJob } from "@gqlOps/job";
import JobForm from "@jobs/jobPost/JobForm";

export default function JobPost() {
  const navigate = useNavigate();
  const { user } = useUserStates();
  const { createJobAsync, loading, data: createData } = useCreateJob();
  const { updateJobAsync, loading: uLoading } = useUpdateJob();
  const [jobForm, setJobForm] = useState<JobInput>(jobConfigs.defaults.jobForm);
  const [isExistingJob, setIsExistingJob] = useState(false);
  const [jobHasNewChanges, setJobHasNewChanges] = useState(false);
  const jobId = createData?.createJob?.id;

  const onCreateJob = () => {
    if (jobHasNewChanges && !isExistingJob && user?.id) {
      createJobAsync({
        variables: {
          userId: user?.id,
          jobInput: { ...jobForm, isDraft: true },
        },
        onSuccess: () => {
          setIsExistingJob(true);
          setJobHasNewChanges(false);
          toast.info("We saved a draft.", { position: "bottom-right" });
        },
      });
    }
  };

  const onUpdateJob = (isDraft: boolean) => {
    const isLastStep = !isDraft;

    if (
      (jobHasNewChanges || isLastStep) &&
      isExistingJob &&
      user?.id &&
      jobId
    ) {
      updateJobAsync({
        userId: user?.id,
        variables: {
          id: jobId,
          jobInput: { ...jobForm, isDraft },
        },
        onSuccess: () => {
          if (!isDraft) {
            toast.success("Job posted successfully.");
            navigateToUserPage({ user, navigate });
          } else {
            setIsExistingJob(true);
            setJobHasNewChanges(false);
            toast.info("We saved a draft.", { position: "bottom-right" });
          }
        },
      });
    }
  };

  const handleJobFormChange = (job: SetStateAction<JobInput>) => {
    setJobForm(job);
    setJobHasNewChanges(true);
  };

  return (
    <JobForm
      jobForm={jobForm}
      setJobForm={handleJobFormChange}
      onCreateJob={onCreateJob}
      onUpdateJob={onUpdateJob}
      loading={loading}
      uLoading={uLoading}
    />
  );
}
