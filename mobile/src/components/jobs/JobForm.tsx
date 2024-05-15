import { StyleSheet } from 'react-native';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { JobInput } from '~/src/graphql/operations/job';
import { useSettingsStates, useUserStates } from '~/src/redux/reduxStates';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import Toast from 'react-native-toast-message';
import { jobConfigs } from '~/src/config/configConst';
import { isAfter, parseISO } from 'date-fns';
import JobBasicDetails from './JobBasicDetails';
import JobBudget from './JobBudget';
import JobDescription from './JobDescription';
import JobPreview from './JobPreview';
import PostJobCont from './PostJobCont';

interface Props {
  jobForm: JobInput;
  setJobForm: Dispatch<SetStateAction<JobInput>>;
  createOrUpdateJob: (isDraft: boolean) => void;
  loading: boolean;
  uLoading: boolean;
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
  onCancel: () => void;
}
const JobForm = ({
  jobForm,
  setJobForm,
  createOrUpdateJob,
  loading,
  uLoading,
  stepIndex,
  setStepIndex,
  onCancel,
}: Props) => {
  const { user } = useUserStates();
  const { isAppLoaded } = useSettingsStates();
  const [errors, setErrors] = useState<IJobErrors>({
    title: '',
    desc: '',
    skills: '',
    budget: { from: '', to: '', maxHours: '' },
    images: '',
    address: '',
    endDate: '',
    startDate: '',
  });

  //redirect if not logged in
  useEffect(() => {
    if (isAppLoaded && !user) router.navigate(Routes.login);
  }, [user, isAppLoaded]);

  const contentProps = { jobForm, setJobForm, errors };
  const steps: IJobStep[] = [
    {
      label: 'Title, Skills & Timeline',
      rightCont: { content: <JobBasicDetails {...contentProps} /> },
      sectionDesc: 'Job size and timeline will help your job post standout to the right candidate.',
    },
    {
      label: 'Project Budget',
      rightCont: { content: <JobBudget {...contentProps} /> },
      sectionDesc:
        'Setting the right budget type is key to finding top talent within your price range for a successful project!',
    },
    {
      label: 'Location & Project Details',
      rightCont: { content: <JobDescription {...contentProps} /> },
      sectionDesc:
        'Crafting a detailed project description ensures clarity and attracts the perfect match for your job!',
    },
    { label: 'Preview', rightCont: { content: <JobPreview job={jobForm} /> } },
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

  const finishDraft = () => {
    const errors = validateFields({ ...valProps, checkAllSteps: true });
    if (errors.length > 0) {
      Toast.show({ type: 'error', text1: 'Fill all required fields!!', position: 'top' });
      return;
    } else createOrUpdateJob(false);
  };

  const isLoading = loading || uLoading;
  return (
    <PostJobCont
      steps={steps}
      stepIndex={stepIndex}
      onNext={onNext}
      onBack={onCancel}
      onNavChange={onNavChange}
      showLeftCont={!isLastStep}
      nextBtnTitle={isLastStep ? 'Post Job' : undefined}
      loading={isLoading}
      sectionDesc={currentStep?.sectionDesc}>
      {currentStep?.rightCont?.content}
    </PostJobCont>
  );
};

export default JobForm;

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
  errors: IJobPost['errors'];
}
type TStepLabel =
  | 'Title, Skills & Timeline'
  | 'Project Budget'
  | 'Location & Project Details'
  | 'Preview';

export interface IJobPost {
  rightCont: IRightCont;
  step: IJobStep;
  errors: IJobErrors;
}

interface IValidateFields {
  stepName: IJobStep['label'];
  jobForm: JobInput;
  setErrors: Dispatch<SetStateAction<IJobErrors>>;
  checkAllSteps?: boolean;
}
const validateFields = ({ stepName, jobForm, setErrors, checkAllSteps }: IValidateFields) => {
  const errors: string[] = [];
  const {
    minTitle,
    minSkills,
    minWage,
    budget: budgetConf,
    minDesc,
    maxImages,
  } = jobConfigs.validations;

  const { title, skills, budget, desc, address, images, startDate, endDate } = jobForm;

  let fieldErrors: IJobErrors = {
    address: '',
    title: '',
    skills: '',
    desc: '',
    images: '',
    budget: {
      from: '',
      to: '',
      maxHours: '',
    },
    endDate: '',
    startDate: '',
  };

  const setErr = (msg: string) => {
    errors.push(msg);
    return msg;
  };

  if (checkAllSteps || stepName === 'Title, Skills & Timeline') {
    if (title.length < minTitle) {
      fieldErrors.title = setErr(`Job title must be more than ${minTitle} characters.`);
    }
    if (skills.length < minSkills) {
      fieldErrors.skills = setErr(`At least ${minSkills} skill must be selected`);
    }
    if (endDate && !startDate) {
      fieldErrors.startDate = setErr('Start date must be selected if end date is chosen.');
    }
    if (startDate && endDate) {
      if (isAfter(parseISO(startDate), parseISO(endDate))) {
        fieldErrors.endDate = setErr('End date must be after the start date.');
      }
    }
  }

  if (checkAllSteps || stepName === 'Project Budget') {
    if (budget.from < minWage) {
      fieldErrors.budget.from = setErr(`From budget must be more than ${minWage}`);
    }
    if (budget.to < minWage) {
      fieldErrors.budget.to = setErr(`To budget must be more than ${minWage}`);
    } else if (budget.from > budget.to) {
      fieldErrors.budget.to = setErr(`To budget cannot be less than From`);
    }
    if (budget.type === 'Hourly' && budget.maxHours < budgetConf.minMaxHours) {
      fieldErrors.budget.maxHours = setErr(
        `Max Hours cannot be less than ${budgetConf.minMaxHours}`
      );
    }
  }

  if (checkAllSteps || stepName === 'Location & Project Details') {
    if (!address) fieldErrors.address = setErr('An address must be selected.');
    if (desc.length < minDesc) {
      fieldErrors.desc = setErr(`Description must be more than ${minDesc} characters`);
    }
    if (images.length > maxImages) {
      fieldErrors.images = setErr(`Maximum of ${maxImages} images allowed`);
    }
  }

  setErrors(fieldErrors);
  return errors;
};
