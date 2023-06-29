import { Dispatch, SetStateAction, FormEvent } from "react";
import UserJobForm, { Job } from "./UserJobForm";

interface Props {
  job: Job;
  setJob: (job: Job) => void;
  setJobs: Dispatch<SetStateAction<Job[] | undefined>>;
  closeEdit: () => void;
}

export default function UserEditJob({
  job,
  setJob,
  setJobs,
  closeEdit,
}: Props) {
  const handleEdit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setJobs((pv) => (pv ? pv.map((j) => (j.id === job.id ? job : j)) : [job]));
    closeEdit();
  };

  return <UserJobForm handleSave={handleEdit} job={job} setJob={setJob} />;
}
