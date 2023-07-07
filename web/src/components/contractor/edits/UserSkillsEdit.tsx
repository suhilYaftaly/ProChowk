import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import { SkillInput, useUpdateContrProf } from "@gqlOps/contractor";
import { useUpdateAllSkills } from "@gqlOps/dataList";
import SkillsSelection, { addSkills } from "@reusable/SkillsSelection";

interface Props {
  userSkills: SkillInput[] | undefined;
  userId: string | undefined;
  closeEdit: () => void;
}

export default function UserSkillsEdit({
  userSkills,
  userId,
  closeEdit,
}: Props) {
  const [selectedSkills, setSelectedSkills] = useState(addSkills(userSkills));
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [newSkills, setNewSkills] = useState<SkillInput[]>([]);
  const { updateContrProfAsync, error, loading } = useUpdateContrProf();
  const { updateAllSkillsAsync } = useUpdateAllSkills();

  useEffect(() => setSelectedSkills(addSkills(userSkills)), [userSkills]);

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    updateContrProfAsync({
      variables: { skills: selectedSkills },
      userId,
      onSuccess: closeEdit,
    });
    if (newSkills?.length > 0) updateAllSkillsAsync({ skills: newSkills });
    setDisableSaveBtn(true);
  };

  //TODO: convert to single image upload instead of multiple
  return (
    <>
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
          setNewSkills={setNewSkills}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={disableSaveBtn}
          fullWidth
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={20} /> : "Save Changes"}
        </Button>
        {error && (
          <Alert severity="error" color="error">
            {error.message}
          </Alert>
        )}
      </Stack>
    </>
  );
}
