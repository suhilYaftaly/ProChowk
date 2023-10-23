import { useState } from "react";

import JobForm from "./JobForm";
import { JobInput, useCreateJob } from "@gqlOps/job";
import { ISkill, useSkills } from "@gqlOps/skill";
import { useUserStates } from "@/redux/reduxStates";
import { getNewSkills } from "@appComps/SkillsSelection";
import CustomModal from "@reusable/CustomModal";

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
  onSuccess: () => void;
}
export default function PostAJob({ open, setOpen, onSuccess }: Props) {
  const { user } = useUserStates();
  const { createJobAsync, loading } = useCreateJob();
  const { updateCache } = useSkills();
  const [allSkills, setAllSkills] = useState<ISkill[]>([]);
  const jobInitialVals: JobInput = {
    title: "",
    desc: "",
    jobSize: "Small",
    skills: [],
    budget: {
      type: "Hourly",
      from: 30,
      to: 50,
      maxHours: 150,
    },
    images: [],
    address: undefined as any,
  };
  const [job, setJob] = useState<JobInput>(jobInitialVals);

  const onAddJob = (job: JobInput) => {
    if (user?.id) {
      createJobAsync({
        variables: { userId: user?.id, jobInput: job },
        onSuccess: (dt) => {
          const newSkills = getNewSkills({
            newList: dt.skills,
            oldList: allSkills,
          });
          if (newSkills && newSkills?.length > 0)
            updateCache("create", newSkills);

          setJob(jobInitialVals);
          onSuccess();
        },
      });
    }
  };

  return (
    <CustomModal title="Post a new job" open={open} onClose={setOpen}>
      <JobForm
        onAddJob={onAddJob}
        job={job}
        setJob={setJob}
        setAllSkills={setAllSkills}
        loading={loading}
      />
    </CustomModal>
  );
}
