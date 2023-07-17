import { useState } from "react";

import JobForm from "./JobForm";
import { JobInput } from "@gqlOps/jobs";

interface Props {
  onAddJob: (job: JobInput) => void;
}

export default function PostAJob({ onAddJob }: Props) {
  const [job, setJob] = useState<JobInput>({
    title: "",
    desc: "",
    jobSize: "Small",
    skills: [],
    budget: {
      type: "Hourly",
      from: "30",
      to: "50",
      maxHours: "150",
    },
    images: [],
    address: undefined as any,
  });

  return <JobForm onAddJob={onAddJob} job={job} setJob={setJob} />;
}
