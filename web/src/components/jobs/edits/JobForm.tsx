import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useState, Dispatch, SetStateAction } from "react";

import JobType from "./JobType";
import JobBudget from "./JobBudget";
import JobDetails from "./JobDetails";
import { IJob, ImagesToDelete, JobInput } from "@gqlOps/job";

export interface IJobError {
  title: string;
  skills: string;
  budgetFrom: string;
  budgetTo: string;
  budgetMaxHour: string;
  desc: string;
  detailsErr: string;
}

interface Props {
  onAddJob: (job: IJob | JobInput, imagesToDelete: ImagesToDelete) => void;
  job: IJob | JobInput;
  setJob: (job: IJob | JobInput) => void;
}

export default function JobForm({ onAddJob, job, setJob }: Props) {
  const [errors, setErrors] = useState<IJobError>(resetErr);
  const [activeStep, setActiveStep] = useState(0);
  const [imgsToDelete, setImgsToDelete] = useState<ImagesToDelete>([]);

  const steps = [
    {
      label: "Job Type",
      comp: <JobType job={job} setJob={setJob} errors={errors} />,
    },
    {
      label: "Budget",
      comp: <JobBudget job={job} setJob={setJob} errors={errors} />,
    },
    {
      label: "Details",
      comp: (
        <JobDetails
          job={job}
          setJob={setJob}
          errors={errors}
          setDeletedImgId={(id) =>
            setImgsToDelete((pv) => (pv ? [...pv, id] : [id]))
          }
        />
      ),
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

  const onSubmit = () => onAddJob(job, imgsToDelete);

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
  detailsErr: "",
};

interface ITestErrInput {
  job: IJob | JobInput;
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
  if (!job?.skills || job?.skills?.length > 7) {
    err = true;
    setErrors((prevErrors) => ({
      ...prevErrors,
      skills: "Max of 7 skills allowed",
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
  if (!job.address) {
    err = true;
    setErrors((pv) => ({ ...pv, detailsErr: "Address must be selected" }));
  }
  if (job?.images && job?.images?.length > 7) {
    err = true;
    setErrors((pv) => ({ ...pv, detailsErr: "Max of 7 images allowed" }));
  }

  return err;
};
