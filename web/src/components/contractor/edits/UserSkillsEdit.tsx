import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import { IContractor, useAddOrRemoveContSkills } from "@gqlOps/contractor";
import SkillsSelection, {
  addSkills,
  getNewSkills,
} from "@appComps/SkillsSelection";
import { ISkill, useSkills } from "@gqlOps/skill";

interface Props {
  contrData: IContractor | undefined;
  closeEdit: () => void;
}

export default function UserSkillsEdit({ contrData, closeEdit }: Props) {
  const [selectedSkills, setSelectedSkills] = useState(
    addSkills(contrData?.skills)
  );
  const [allSkills, setAllSkills] = useState<ISkill[]>([]);
  const { addOrRemoveContSkillsAsync, error, loading, contLoading } =
    useAddOrRemoveContSkills();
  const { updateCache } = useSkills();

  useEffect(
    () => setSelectedSkills(addSkills(contrData?.skills)),
    [contrData?.skills]
  );

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (contrData) {
      addOrRemoveContSkillsAsync({
        variables: { skills: selectedSkills, contId: contrData.id },
        onSuccess: (dt) => {
          const newSkills = getNewSkills({
            newList: dt.skills,
            oldList: allSkills,
          });
          if (newSkills && newSkills?.length > 0)
            updateCache("create", newSkills);
          closeEdit();
        },
      });
    }
  };

  return (
    <Stack
      component="form"
      sx={{ pt: 3, pb: 1, overflow: "hidden" }}
      noValidate
      autoComplete="off"
      onSubmit={handleSave}
    >
      <SkillsSelection
        skills={selectedSkills}
        setSkills={setSelectedSkills}
        setAllSkills={setAllSkills}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || contLoading}
        fullWidth
        sx={{ mt: 3 }}
      >
        {loading || contLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Save Changes"
        )}
      </Button>
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
    </Stack>
  );
}
