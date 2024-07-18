import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { useUserStates } from '~/src/redux/reduxStates';
import { JobInput, useCreateJob, useJob, useUpdateJob } from '~/src/graphql/operations/job';
import { jobConfigs } from '~/src/config/configConst';
import { removeServerMetadata } from '~/src/utils/utilFuncs';
import Toast from 'react-native-toast-message';
import JobForm from './JobForm';
import labels from '~/src/constants/labels';
type Props = {
  onCancel: (isJobPosted: boolean) => void;
  jobID?: string | string[];
};

const JobPost = ({ onCancel, jobID }: Props) => {
  const { user } = useUserStates();
  const { createJobAsync, loading: cLoading, data: createData } = useCreateJob();
  const { updateJobAsync, loading: uLoading } = useUpdateJob();
  const [jobForm, setJobForm] = useState<JobInput>(jobConfigs.defaults.jobForm);
  const [isExistingJob, setIsExistingJob] = useState(false);
  const [jobHasNewChanges, setJobHasNewChanges] = useState(false);
  const { jobAsync, data: existingJob } = useJob();
  const [stepIndex, setStepIndex] = useState(0);
  const jobId = createData?.createJob?.id || existingJob?.job?.id;

  useEffect(() => {
    if (jobID && typeof jobID === 'string') {
      jobAsync({
        variables: { id: jobID },
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
          setStepIndex(getDraftIndex(cj));
          onJobChange();
          Toast.show({
            type: 'info',
            text1: `${labels.draftLoaded}`,
            position: 'top',
          });
        },
      });
    }
  }, [jobID]);

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
          Toast.show({
            type: 'info',
            text1: `${labels.jobSaveDraftMsg}`,
            position: 'top',
          });
        },
      });
    }
  };

  const onUpdateJob = (isDraft: boolean) => {
    const isLastStep = !isDraft;
    if ((jobHasNewChanges || isLastStep) && isExistingJob && user?.id && jobId) {
      updateJobAsync({
        userId: user?.id,
        variables: {
          id: jobId,
          jobInput: { ...jobForm, isDraft },
        },
        onSuccess: () => {
          if (isLastStep) {
            onCancel(true);
          } else {
            onJobChange();
            Toast.show({
              type: 'info',
              text1: `${labels.jobSaveDraftMsg}`,
              position: 'top',
            });
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

  const getDraftIndex = (draftData: any) => {
    if (draftData) {
      if (!draftData?.title || draftData?.skill?.length === 0) {
        return 0;
      } else if (!draftData?.budget) {
        return 1;
      } else if (!draftData?.desc || !draftData?.address) {
        return 2;
      } else return 3;
    } else return 0;
  };

  return (
    <JobForm
      jobForm={jobForm}
      setJobForm={handleJobFormChange}
      createOrUpdateJob={createOrUpdateJob}
      loading={cLoading}
      uLoading={uLoading}
      stepIndex={stepIndex}
      setStepIndex={setStepIndex}
      onCancel={() => onCancel(false)}
    />
  );
};

export default JobPost;
