import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import { IContractor, useAddOrRemoveContSkills } from "@gqlOps/contractor";
import SkillsSelection, { addSkills } from "@appComps/SkillsSelection";

interface Props {
  contrData: IContractor | undefined;
  closeEdit: () => void;
}

export default function UserSkillsEdit({ contrData, closeEdit }: Props) {
  const [selectedSkills, setSelectedSkills] = useState(
    addSkills(contrData?.skills)
  );
  const { addOrRemoveContSkillsAsync, error, loading, contLoading } =
    useAddOrRemoveContSkills();

  useEffect(
    () => setSelectedSkills(addSkills(contrData?.skills)),
    [contrData?.skills]
  );

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (contrData) {
      addOrRemoveContSkillsAsync({
        variables: { skills: selectedSkills, contId: contrData.id },
        onSuccess: closeEdit,
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
      <SkillsSelection skills={selectedSkills} setSkills={setSelectedSkills} />
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
