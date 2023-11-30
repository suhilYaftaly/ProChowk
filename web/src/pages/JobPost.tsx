import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CenteredStack from "@reusable/CenteredStack";
import JobNav from "@jobs/jobPost/JobNav";
import JobContainer from "@jobs/jobPost/JobContainer";
import { JobInput, useCreateJob } from "@gqlOps/job";
import JobSize from "@jobs/jobPost/JobSize";
import JobTitleAndSkills from "@jobs/jobPost/JobTitleAndSkills";
import JobBudget from "@jobs/jobPost/JobBudget";
import { jobConfigs } from "@/config/configConst";
import JobDescription from "@jobs/jobPost/JobDescription";
import JobPreview from "@/components/jobs/jobPost/JobPreview";
import { useIsMobile } from "@/utils/hooks/hooks";
import ToastErrorsList from "@reusable/ToastErrorsList";
import { useSettingsStates, useUserStates } from "@/redux/reduxStates";
import { navigateToUserPage } from "@/utils/utilFuncs";
import { paths } from "@/routes/Routes";

export default function JobPost() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useUserStates();
  const { isAppLoaded } = useSettingsStates();
  const { createJobAsync, loading } = useCreateJob();
  const [stepIndex, setStepIndex] = useState(0);
  const [jobForm, setJobForm] = useState<JobInput>(jobConfigs.defaults.jobForm);
  const [errors, setErrors] = useState<IJobErrors>({
    title: "",
    desc: "",
    skills: "",
    budget: { from: "", to: "", maxHours: "" },
    images: "",
    address: "",
    materials: "",
  });

  //redirect if not logged in
  useEffect(() => {
    if (isAppLoaded && !user) navigate(paths.login);
  }, [user, isAppLoaded]);

  const contentProps = { jobForm, setJobForm, errors };
  const steps: IJobStep[] = [
    {
      label: "Size & Location",
      rightCont: { content: <JobSize {...contentProps} /> },
    },
    {
      label: "Title & Skills",
      rightCont: { content: <JobTitleAndSkills {...contentProps} /> },
    },
    {
      label: "Budget",
      rightCont: { content: <JobBudget {...contentProps} /> },
    },
    {
      label: "Description",
      rightCont: { content: <JobDescription {...contentProps} /> },
    },
    { label: "Preview", rightCont: { content: <JobPreview job={jobForm} /> } },
  ];

  const currentStep = steps[stepIndex];
  const valProps = { jobForm, stepName: currentStep.label, setErrors };
  const isLastStep = steps.length === stepIndex + 1;

  const onNavChange = (newIndex: number) => {
    const errors = validateFields(valProps);
    if (errors.length < 1) setStepIndex(newIndex);
  };
  const onNext = () => {
    if (isLastStep) onPostJob();
    else {
      const errors = validateFields(valProps);
      if (errors.length < 1) setStepIndex((prev) => prev + 1);
    }
  };
  const onBack = () => {
    const errors = validateFields(valProps);
    if (errors.length < 1) setStepIndex((prev) => prev - 1);
  };

  const onSaveDraft = () => {
    if (isLastStep) onPostJob();
    else navigate("/");
  };

  const onPostJob = () => {
    const errors = validateFields({ ...valProps, checkAllSteps: true });
    if (errors.length > 0) {
      toast.error(ToastErrorsList({ errors }));
      return;
    }
    if (user?.id) {
      createJobAsync({
        variables: { userId: user?.id, jobInput: jobForm },
        onSuccess: () => {
          toast.success("Job posted successfully."),
            navigateToUserPage({ user, navigate });
        },
      });
    }
  };

  return (
    <Stack>
      {!isMobile && (
        <JobNav steps={steps} stepIndex={stepIndex} onChange={onNavChange}>
          <Button
            variant={isLastStep ? "contained" : "outlined"}
            onClick={onSaveDraft}
            sx={{ borderRadius: 5 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={25} color="primary" />
            ) : isLastStep ? (
              "Post Job"
            ) : (
              "Cancel"
            )}
          </Button>
        </JobNav>
      )}
      <CenteredStack mmx={0} addCard cardSX={{ p: 0 }}>
        <JobContainer
          steps={steps}
          stepIndex={stepIndex}
          onNext={onNext}
          onBack={onBack}
          showLeftCont={!isLastStep}
          nextBtnTitle={isLastStep ? "Post Job" : undefined}
          loading={loading}
        >
          {currentStep?.rightCont?.content}
        </JobContainer>
      </CenteredStack>
    </Stack>
  );
}

//INTERFACES
interface IRightCont {
  content: ReactNode;
}
interface IJobStep {
  label: TStepLabel;
  rightCont: IRightCont;
}
interface IJobErrors {
  title: string;
  desc: string;
  skills: string;
  budget: { from: string; to: string; maxHours: string };
  images: string;
  address: string;
  materials: string;
}
export interface IJobSteps {
  jobForm: JobInput;
  setJobForm: Dispatch<SetStateAction<JobInput>>;
  errors: IJobPost["errors"];
}
type TStepLabel =
  | "Size & Location"
  | "Title & Skills"
  | "Budget"
  | "Description"
  | "Preview";

export interface IJobPost {
  rightCont: IRightCont;
  step: IJobStep;
  errors: IJobErrors;
}

interface IValidateFields {
  stepName: IJobStep["label"];
  jobForm: JobInput;
  setErrors: Dispatch<SetStateAction<IJobErrors>>;
  checkAllSteps?: boolean;
}
const validateFields = ({
  stepName,
  jobForm,
  setErrors,
  checkAllSteps,
}: IValidateFields) => {
  const errors: string[] = [];
  const {
    minTitle,
    minSkills,
    minWage,
    budget: budgetConf,
    minDesc,
    maxImages,
  } = jobConfigs.validations;

  const { title, skills, budget, desc, address, images } = jobForm;

  let fieldErrors: IJobErrors = {
    address: "",
    title: "",
    skills: "",
    desc: "",
    images: "",
    materials: "",
    budget: {
      from: "",
      to: "",
      maxHours: "",
    },
  };

  const setErr = (msg: string) => {
    errors.push(msg);
    return msg;
  };

  if (checkAllSteps || stepName === "Size & Location") {
    if (!address) fieldErrors.address = setErr("An address must be selected.");
  }

  if (checkAllSteps || stepName === "Title & Skills") {
    if (title.length < minTitle) {
      fieldErrors.title = setErr(
        `Job title must be more than ${minTitle} characters.`
      );
    }
    if (skills.length < minSkills) {
      fieldErrors.skills = setErr(
        `At least ${minSkills} skill must be selected`
      );
    }
  }

  if (checkAllSteps || stepName === "Budget") {
    if (budget.from < minWage) {
      fieldErrors.budget.from = setErr(
        `From budget must be more than ${minWage}`
      );
    }
    if (budget.to < minWage) {
      fieldErrors.budget.to = setErr(`To budget must be more than ${minWage}`);
    } else if (budget.from > budget.to) {
      fieldErrors.budget.to = setErr(`To budget cannot be less than From`);
    }
    if (budget.type === "Hourly" && budget.maxHours < budgetConf.minMaxHours) {
      fieldErrors.budget.maxHours = setErr(
        `Max Hours cannot be less than ${budgetConf.minMaxHours}`
      );
    }
  }

  if (checkAllSteps || stepName === "Description") {
    if (desc.length < minDesc) {
      fieldErrors.desc = setErr(
        `Description must be more than ${minDesc} characters`
      );
    }
    if (images.length > maxImages) {
      fieldErrors.images = setErr(`Maximum of ${maxImages} images allowed`);
    }
  }

  setErrors(fieldErrors);
  return errors;
};
