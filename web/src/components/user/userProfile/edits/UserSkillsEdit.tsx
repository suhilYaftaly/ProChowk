import { Button, CircularProgress, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

import { IUpdateUserInput } from "@gqlOps/user";
import SkillsSelection, {
  addSkills,
  getNewSkills,
} from "@appComps/SkillsSelection";
import { IContractor, useUpdateContSkills } from "@gqlOps/contractor";
import { ISkill, SkillInput, useSkills } from "@gqlOps/skill";

interface Props {
  onClose: () => void;
  contractor: IContractor;
}
export default function UserSkillsEdit({ contractor, onClose }: Props) {
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [allSkills, setAllSkills] = useState<ISkill[]>([]);
  const [form, setForm] = useState({ skills: addSkills(contractor?.skills) });
  const [errors, setErrors] = useState<IFormErrs>({ skills: "" });
  const { updateContSkillsAsync, loading } = useUpdateContSkills();
  const { updateCache } = useSkills();

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm({ form, setErrors })) return;
    setDisableSaveBtn(true);

    if (contractor) {
      updateContSkillsAsync({
        variables: { skills: form.skills, contId: contractor.id },
        onSuccess: (dt) => {
          const newSkills = getNewSkills({
            newList: dt.skills,
            oldList: allSkills,
          });
          if (newSkills && newSkills?.length > 0) {
            updateCache("create", newSkills);
          }

          toast.success("Profile updated successfully!", {
            position: "bottom-right",
          });
          onClose();
        },
      });
    }
  };

  const onSkillsChange = (skills: SkillInput[]) => {
    setDisableSaveBtn(false);
    setForm((prev) => ({ ...prev, skills }));
  };

  return (
    <Stack component={"form"} onSubmit={handleSaveChanges} spacing={4}>
      <SkillsSelection
        skills={form.skills}
        setSkills={onSkillsChange}
        required
        error={Boolean(errors.skills)}
        helperText={errors.skills}
        setAllSkills={setAllSkills}
      />
      <Button variant="contained" disabled={disableSaveBtn} type="submit">
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </Stack>
  );
}

interface IFormErrs {
  skills: string;
}
interface IValidateProps {
  form: IUpdateUserInput;
  setErrors: Dispatch<SetStateAction<IFormErrs>>;
}
/**sets the errors and returns hasErrors @returns hasErrors as boolean */
const validateForm = ({ form, setErrors }: IValidateProps) => {
  let hasError = false;
  let formErrs: IFormErrs = { skills: "" };

  if (form.skills && form.skills.length < 1) {
    formErrs.skills = "You must select at least 1 skill.";
    hasError = true;
  }

  setErrors(formErrs);
  return hasError;
};
