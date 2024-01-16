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
import { isAfter, parseISO } from "date-fns";

import CenteredStack from "@reusable/CenteredStack";
import DJobNav from "@jobs/jobPost/desktop/DJobNav";
import JobContainer from "@/components/jobs/jobPost/forms/JobContainer";
import { JobInput } from "@gqlOps/job";
import JobSize from "@/components/jobs/jobPost/forms/JobSize";
import JobTitleAndSkills from "@/components/jobs/jobPost/forms/JobTitleAndSkills";
import JobBudget from "@/components/jobs/jobPost/forms/JobBudget";
import { jobConfigs } from "@/config/configConst";
import JobDescription from "@/components/jobs/jobPost/forms/JobDescription";
import JobPreview from "@jobs/jobPost/JobPreview";
import { useIsMobile, useRespVal } from "@/utils/hooks/hooks";
import ToastErrorsList from "@reusable/ToastErrorsList";
import { useSettingsStates, useUserStates } from "@/redux/reduxStates";
import { paths } from "@/routes/Routes";
import MJobNav from "@jobs/jobPost/mobile/MJobNav";

interface Props {
  jobForm: JobInput;
  setJobForm: Dispatch<React.SetStateAction<JobInput>>;
  createOrUpdateJob: (isDraft: boolean) => void;
  loading: boolean;
  uLoading: boolean;
  stepIndex: number;
  setStepIndex: Dispatch<React.SetStateAction<number>>;
}
export default function JobForm({
  jobForm,
  setJobForm,
  createOrUpdateJob,
  loading,
  uLoading,
  stepIndex,
  setStepIndex,
}: Props) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useUserStates();
  const { isAppLoaded } = useSettingsStates();
  const [errors, setErrors] = useState<IJobErrors>({
    title: "",
    desc: "",
    skills: "",
    budget: { from: "", to: "", maxHours: "" },
    images: "",
    address: "",
    endDate: "",
    startDate: "",
  });

  //redirect if not logged in
  useEffect(() => {
    if (isAppLoaded && !user) navigate(paths.login);
  }, [user, isAppLoaded]);

  const contentProps = { jobForm, setJobForm, errors };
  const steps: IJobStep[] = [
    {
      label: "Size & Timeline",
      rightCont: { content: <JobSize {...contentProps} /> },
      sectionDesc:
        "Job size and timeline will help your job post standout to the right candidate.",
    },
    {
      label: "Title & Skills",
      rightCont: { content: <JobTitleAndSkills {...contentProps} /> },
      sectionDesc:
        "Choosing the right job title and specifying the required skills will attract the perfect candidates to your job post!",
    },
    {
      label: "Budget",
      rightCont: { content: <JobBudget {...contentProps} /> },
      sectionDesc:
        "Setting the right budget type is key to finding top talent within your price range for a successful project!",
    },
    {
      label: "Description & Location",
      rightCont: { content: <JobDescription {...contentProps} /> },
      sectionDesc:
        "Crafting a detailed project description ensures clarity and attracts the perfect match for your job!",
    },
    { label: "Preview", rightCont: { content: <JobPreview job={jobForm} /> } },
  ];

  const isLastStep = steps.length === stepIndex + 1;
  const currentStep = steps[stepIndex];
  const prevStep = stepIndex > 0 && steps?.[stepIndex - 1];
  const nextStep = steps?.[stepIndex + 1];
  const valProps = { jobForm, stepName: currentStep.label, setErrors };

  const onNavChange = (newIndex: number) => {
    if (stepIndex > newIndex) setStepIndex(newIndex);
    else {
      const errors = validateFields(valProps);
      if (errors.length < 1) setStepIndex(newIndex);
    }
  };
  const onNext = () => {
    if (isLastStep) finishDraft();
    else {
      const errors = validateFields(valProps);
      if (errors.length < 1) {
        setStepIndex((prev) => prev + 1);
        createOrUpdateJob(true);
      }
    }
  };

  const onCancel = () => navigate("/");

  const onMobileHeaderClick = () => {
    if (prevStep) {
      const errors = validateFields(valProps);
      if (errors.length < 1) setStepIndex((prev) => prev - 1);
    } else navigate("/");
  };

  const finishDraft = () => {
    const errors = validateFields({ ...valProps, checkAllSteps: true });
    if (errors.length > 0) {
      toast.error(ToastErrorsList({ errors }));
      return;
    } else createOrUpdateJob(false);
  };

  const isLoading = loading || uLoading;

  return (
    <Stack>
      {isMobile ? (
        <MJobNav
          title={currentStep?.label}
          subtitle={nextStep?.label}
          currentStepNum={stepIndex + 1}
          totalSteps={steps?.length}
          onClick={onMobileHeaderClick}
        />
      ) : (
        <DJobNav steps={steps} stepIndex={stepIndex} onChange={onNavChange}>
          {isLastStep && (
            <Button
              variant="contained"
              onClick={finishDraft}
              sx={{ borderRadius: 5 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={25} color="primary" />
              ) : (
                "Post Job"
              )}
            </Button>
          )}
        </DJobNav>
      )}
      <CenteredStack
        mmx={0}
        addCard
        cardSX={{ p: 0 }}
        contSX={{ my: useRespVal(0, 2) }}
      >
        <JobContainer
          steps={steps}
          stepIndex={stepIndex}
          onNext={onNext}
          onBack={onCancel}
          showLeftCont={!isLastStep}
          nextBtnTitle={isLastStep ? "Post Job" : undefined}
          loading={isLoading}
          sectionDesc={currentStep?.sectionDesc}
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
  sectionDesc?: string;
}
interface IJobErrors {
  title: string;
  desc: string;
  skills: string;
  budget: { from: string; to: string; maxHours: string };
  images: string;
  address: string;
  endDate: string;
  startDate: string;
}
export interface IJobSteps {
  jobForm: JobInput;
  setJobForm: Dispatch<SetStateAction<JobInput>>;
  errors: IJobPost["errors"];
}
type TStepLabel =
  | "Size & Timeline"
  | "Title & Skills"
  | "Budget"
  | "Description & Location"
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

  const { title, skills, budget, desc, address, images, startDate, endDate } =
    jobForm;

  let fieldErrors: IJobErrors = {
    address: "",
    title: "",
    skills: "",
    desc: "",
    images: "",
    budget: {
      from: "",
      to: "",
      maxHours: "",
    },
    endDate: "",
    startDate: "",
  };

  const setErr = (msg: string) => {
    errors.push(msg);
    return msg;
  };

  if (checkAllSteps || stepName === "Size & Timeline") {
    if (endDate && !startDate) {
      fieldErrors.startDate = setErr(
        "Start date must be selected if end date is chosen."
      );
    }
    if (startDate && endDate) {
      if (isAfter(parseISO(startDate), parseISO(endDate))) {
        fieldErrors.endDate = setErr("End date must be after the start date.");
      }
    }
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

  if (checkAllSteps || stepName === "Description & Location") {
    if (!address) fieldErrors.address = setErr("An address must be selected.");
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
