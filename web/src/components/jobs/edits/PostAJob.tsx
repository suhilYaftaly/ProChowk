import { useState } from "react";

import JobForm, { IJob } from "./JobForm";

interface Props {
  onAddJob: (job: IJob) => void;
}

export default function PostAJob({ onAddJob }: Props) {
  const [job, setJob] = useState<IJob>({
    id: String(Math.random()),
    title: "",
    desc: "",
    jobSize: "Small",
    skills: undefined,
    budget: {
      type: "Hourly",
      from: "30",
      to: "50",
      maxHours: "150",
    },
    images: [],
  });

  return <JobForm onAddJob={onAddJob} job={job} setJob={setJob} />;
}
