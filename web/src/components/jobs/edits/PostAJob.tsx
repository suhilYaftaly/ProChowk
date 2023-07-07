import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useState, Dispatch, SetStateAction } from "react";

import { SkillInput } from "@gqlOps/contractor";
import JobType from "./JobType";
import { useUpdateAllSkills } from "@gqlOps/dataList";

export interface IJob {
  id: string;
  title: string;
  desc: string;
  jobSize: "Small" | "Medium" | "Large";
  skills: SkillInput[] | undefined;
}
export interface IJobError {
  title: string;
  skills: string;
}

export default function PostAJob() {
  const [errors, setErrors] = useState<IJobError>(resetErr);
  const [job, setJob] = useState<IJob>({
    id: String(Math.random()),
    title: "",
    desc: "",
    jobSize: "Small",
    skills: undefined,
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
    { label: "Budget", comp: <>Coming Soon!!</> },
    { label: "Post", comp: <>Coming Soon!!</> },
  ];

  const handleNext = () => {
    if (steps[activeStep].label === "Job Type") {
      const error = testJobTypeFields({ job, setErrors });
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
  };

  return (
    <Box sx={{ my: 2 }}>
      <Stepper activeStep={activeStep}>
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

const resetErr = { title: "", skills: "" };

interface ITestJTInput {
  job: IJob;
  setErrors: Dispatch<SetStateAction<IJobError>>;
}
const testJobTypeFields = ({ job, setErrors }: ITestJTInput): boolean => {
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
