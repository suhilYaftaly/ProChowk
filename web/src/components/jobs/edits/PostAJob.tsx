import { useState } from "react";

import JobForm from "./JobForm";
import { JobInput } from "@gqlOps/job";
import { ISkill } from "@gqlOps/skill";

interface Props {
  onAddJob: (job: JobInput) => void;
  setAllSkills?: (skills: ISkill[]) => void;
}

export default function PostAJob({ onAddJob, setAllSkills }: Props) {
  const [job, setJob] = useState<JobInput>({
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
  });

  return (
    <JobForm
      onAddJob={onAddJob}
      job={job}
      setJob={setJob}
      setAllSkills={setAllSkills}
    />
  );
}
