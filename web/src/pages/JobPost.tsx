import { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { jobConfigs } from "@/config/configConst";
import { useUserStates } from "@/redux/reduxStates";
import { removeServerMetadata } from "@/utils/utilFuncs";
import { JobInput, useCreateJob, useJob, useUpdateJob } from "@gqlOps/job";
import JobForm from "@jobs/jobPost/forms/JobForm";
import { CircularProgress } from "@mui/material";
import AppContainer from "@reusable/AppContainer";
import { paths } from "@/routes/Routes";

export default function JobPost() {
  const [searchParams] = useSearchParams();
  const jobIdQuery = searchParams.get("jobId");
  const navigate = useNavigate();
  const { user } = useUserStates();
  const {
    createJobAsync,
    loading: cLoading,
    data: createData,
  } = useCreateJob();
  const { updateJobAsync, loading: uLoading } = useUpdateJob();
  const [jobForm, setJobForm] = useState<JobInput>(jobConfigs.defaults.jobForm);
  const [isExistingJob, setIsExistingJob] = useState(false);
  const [jobHasNewChanges, setJobHasNewChanges] = useState(false);
  const { jobAsync, loading, data: existingJob } = useJob();
  const [stepIndex, setStepIndex] = useState(0);
  const hasShownToast = useRef(false);
  const jobId = createData?.createJob?.id || existingJob?.job?.id;

  useEffect(() => {
    if (jobIdQuery)
      jobAsync({
        variables: { id: jobIdQuery },
        onSuccess: (existingJob) => {
          const cj = removeServerMetadata(existingJob);
          setJobForm({
            title: cj.title,
            desc: cj.desc,
            jobSize: cj.jobSize,
            skills: cj.skills ?? [],
            budget: cj.budget,
            images: cj.images ?? [],
            address: cj.address,
            startDate: cj.startDate,
            endDate: cj.endDate,
            isDraft: cj.isDraft,
          });
          setStepIndex(1);
          onJobChange();
          if (!hasShownToast.current) {
            toast.success(
              "Draft loaded, continue editing to complete this draft.",
              { position: "bottom-right" }
            );
            hasShownToast.current = true;
          }
        },
      });
  }, [jobIdQuery]);

  const onJobChange = () => {
    setIsExistingJob(true);
    setJobHasNewChanges(false);
  };

  const onCreateJob = () => {
    if (jobHasNewChanges && !isExistingJob && user?.id) {
      createJobAsync({
        variables: {
          userId: user?.id,
          jobInput: { ...jobForm, isDraft: true },
        },
        onSuccess: () => {
          onJobChange();
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
          if (isLastStep) {
            toast.success("Job posted successfully.");
            navigate(paths.userJobTypes("Posted"));
          } else {
            onJobChange();
            toast.info("We saved a draft.", { position: "bottom-right" });
          }
        },
      });
    }
  };

  const createOrUpdateJob = (isDraft: boolean) => {
    if (user?.id) {
      if (isExistingJob && jobId) onUpdateJob(isDraft);
      else if (!isExistingJob) onCreateJob();
    }
  };

  const handleJobFormChange = (job: SetStateAction<JobInput>) => {
    setJobForm(job);
    setJobHasNewChanges(true);
  };

  return (
    <>
      {loading ? (
        <AppContainer addCard sx={{ textAlign: "center" }}>
          <CircularProgress size={150} color="primary" sx={{ m: 5 }} />
        </AppContainer>
      ) : (
        <JobForm
          jobForm={jobForm}
          setJobForm={handleJobFormChange}
          createOrUpdateJob={createOrUpdateJob}
          loading={cLoading}
          uLoading={uLoading}
          stepIndex={stepIndex}
          setStepIndex={setStepIndex}
        />
      )}
    </>
  );
}
