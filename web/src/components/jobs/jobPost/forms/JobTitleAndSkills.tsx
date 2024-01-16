import { ChangeEvent } from "react";
import { TextField } from "@mui/material";

import { IJobSteps } from "./JobForm";
import SkillsSelection from "@reusable/appComps/SkillsSelection";
import Text from "@reusable/Text";

export default function JobTitleAndSkills({
  jobForm,
  setJobForm,
  errors,
}: IJobSteps) {
  const mb = 1;
  const mt = 3;
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Text type="subtitle" sx={{ mb }}>
        Enter a job title
      </Text>
      <TextField
        variant="outlined"
        size="small"
        name={"title"}
        value={jobForm.title}
        onChange={onValueChange}
        placeholder={
          "Seeking Experienced Contractor for Comprehensive Home Renovation Project"
        }
        error={Boolean(errors.title)}
        helperText={errors.title}
        required
      />
      <Text type="subtitle" sx={{ mt, mb }}>
        Search or add up to 10 skills
      </Text>
      <SkillsSelection
        label=""
        skills={jobForm.skills}
        setSkills={(skills) => setJobForm((prev) => ({ ...prev, skills }))}
        required
        error={Boolean(errors.skills)}
        helperText={errors.skills}
        chipColor="default"
      />
    </>
  );
}
