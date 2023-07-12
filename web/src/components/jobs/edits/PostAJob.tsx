import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useState, Dispatch, SetStateAction } from "react";

import { SkillInput } from "@gqlOps/contractor";
import JobType from "./JobType";
import { useUpdateAllSkills } from "@gqlOps/dataList";
import JobBudget from "./JobBudget";
import JobDetails from "./JobDetails";
import JobLocation from "./JobLocation";
import { IImage } from "@reusable/ImageUpload";

interface IJobBudget {
  type: "Hourly" | "Project";
  from: string;
  to: string;
  maxHours: string;
}
interface IJobLocation {
  radius: number;
  lat?: number;
  lng?: number;
}

export interface IJob {
  id: string;
  title: string;
  desc: string;
  jobSize: "Small" | "Medium" | "Large";
  skills: SkillInput[] | undefined;
  budget: IJobBudget;
  location: IJobLocation;
  images: IImage[];
}
export interface IJobError {
  title: string;
  skills: string;
  budgetFrom: string;
  budgetTo: string;
  budgetMaxHour: string;
  desc: string;
  radius: string;
  lat: string;
  lng: string;
}

export default function PostAJob() {
  const [errors, setErrors] = useState<IJobError>(resetErr);
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
    location: { radius: 40 },
    images: [],
  });
  const [newSkills, setNewSkills] = useState<SkillInput[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const { updateAllSkillsAsync } = useUpdateAllSkills();

  const steps = [
    {
      label: "Job Type",
      comp: (
        <JobType
          job={job}
          setJob={setJob}
          errors={errors}
          setNewSkills={setNewSkills}
        />
      ),
    },
    {
      label: "Budget",
      comp: <JobBudget job={job} setJob={setJob} errors={errors} />,
    },
    {
      label: "Details",
      comp: <JobDetails job={job} setJob={setJob} errors={errors} />,
    },
    {
      label: "Location",
      comp: <JobLocation job={job} setJob={setJob} errors={errors} />,
    },
  ];

  const handleNext = () => {
    if (steps[activeStep].label === "Job Type") {
      const error = testJobTypeFields({ job, setErrors });
      if (error) return;
    }
    if (steps[activeStep].label === "Budget") {
      const error = testBudgetFields({ job, setErrors });
      if (error) return;
    }
    if (steps[activeStep].label === "Details") {
      const error = testDetailsFields({ job, setErrors });
      if (error) return;
    }

    if (activeStep === steps.length - 1) {
      onSubmit();
    } else {
      setActiveStep((pv) => pv + 1);
    }
  };
  const handleBack = () => setActiveStep((pv) => pv - 1);

  const onSubmit = () => {
    if (newSkills?.length > 0) updateAllSkillsAsync({ skills: newSkills });
    console.log(job);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ my: 4, mx: 1 }}>{steps?.[activeStep]?.comp}</Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

const resetErr = {
  title: "",
  skills: "",
  budgetFrom: "",
  budgetTo: "",
  budgetMaxHour: "",
  desc: "",
  radius: "",
  lat: "",
  lng: "",
};

interface ITestErrInput {
  job: IJob;
  setErrors: Dispatch<SetStateAction<IJobError>>;
}
const testJobTypeFields = ({ job, setErrors }: ITestErrInput): boolean => {
  let err = false;
  setErrors(resetErr);

  if (job?.title?.length < 3) {
    err = true;
    setErrors((pv) => ({ ...pv, title: "Must have more than 3 chars" }));
  }
  if (!job?.skills || job?.skills?.length < 1) {
    err = true;
    setErrors((prevErrors) => ({
      ...prevErrors,
      skills: "You must add at least one skill",
    }));
  }

  return err;
};
const testBudgetFields = ({ job, setErrors }: ITestErrInput): boolean => {
  let err = false;
  setErrors(resetErr);

  if (Number(job?.budget?.from) < 14) {
    err = true;
    setErrors((pv) => ({ ...pv, budgetFrom: "Must be more than 14" }));
  }
  if (Number(job?.budget?.to) < 14) {
    err = true;
    setErrors((pv) => ({ ...pv, budgetTo: "Must be more than 14" }));
  }
  if (job.budget.type === "Hourly" && Number(job?.budget?.maxHours) < 1) {
    err = true;
    setErrors((pv) => ({ ...pv, budgetMaxHour: "Cannot be empty" }));
  }

  return err;
};
const testDetailsFields = ({ job, setErrors }: ITestErrInput): boolean => {
  let err = false;
  setErrors(resetErr);

  if (job.desc.length < 10) {
    err = true;
    setErrors((pv) => ({ ...pv, desc: "Must be more than 10 chars" }));
  }

  return err;
};
