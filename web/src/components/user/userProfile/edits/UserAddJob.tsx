import { useState, Dispatch, SetStateAction, FormEvent } from "react";
import UserJobForm, { Job } from "./UserJobForm";

interface Props {
  setJobs: Dispatch<SetStateAction<Job[] | undefined>>;
  closeEdit: () => void;
}

export default function UserAddJob({ setJobs, closeEdit }: Props) {
  const [job, setJob] = useState<Job>({
    id: String(Math.random()),
    title: "",
    desc: "",
  });

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setJobs((pv) => (pv ? [...pv, job] : [job]));
    closeEdit();
  };

  return <UserJobForm handleSave={handleSave} job={job} setJob={setJob} />;
}
