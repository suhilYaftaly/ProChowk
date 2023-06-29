import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import { SkillsInput, useUpdateContrProf } from "@gqlOps/contractor";
import { useGetAllSkills, useUpdateAllSkills } from "@gqlOps/dataList";
import ErrSnackbar from "@/components/ErrSnackbar";

interface Props {
  userSkills: SkillsInput[] | undefined;
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
  const [openSkillsErrBar, setOpenSkillsErrBar] = useState(false);
  const [newSkills, setNewSkills] = useState<SkillsInput[]>([]);
  const { updateContrProfAsync, error, loading } = useUpdateContrProf();
  const { updateAllSkillsAsync } = useUpdateAllSkills();
  const {
    getAllSkillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
    error: allSkillsError,
  } = useGetAllSkills();
  const allSkillsData = allSkillsType?.getAllSkills?.data;

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
  const handleAdd = (newSkill: SkillsInput) => {
    const exists = selectedSkills?.some((s) => s.label === newSkill.label);
    if (!exists) {
      //create new skills list to add to backend allSkills
      const existsInAllSkills = allSkillsData?.some(
        (s) => s.label === newSkill.label
      );
      if (!existsInAllSkills) setNewSkills((pv) => [...pv, newSkill]);

      setSelectedSkills((pv) => pv && [...pv, newSkill]);
      setDisableSaveBtn(false);
    }
  };
  const handleDelete = (skillToDelete: SkillsInput) => () => {
    setDisableSaveBtn(false);
    setSelectedSkills((skills) =>
      skills?.filter((skill) => skill.label !== skillToDelete.label)
    );
    setNewSkills((skills) =>
      skills?.filter((skill) => skill.label !== skillToDelete.label)
    );
  };
  const onSkillSelection = (_: any, value: SkillsInput | null | string) => {
    if (value && typeof value === "string") {
      const newSkill = { label: value };
      handleAdd(newSkill);
    } else if (value && typeof value !== "string") {
      const newSkill = { label: value.label };
      handleAdd(newSkill);
    }
  };

  //TODO: convert to single image upload instead of multiple
  return (
    <>
      <Stack
        component="form"
        sx={{ pt: 3, pb: 1, overflow: "hidden" }}
        spacing={2}
        noValidate
        autoComplete="off"
        onSubmit={handleSave}
      >
        <Autocomplete
          onOpen={getAllSkillsAsync}
          loading={allSkillsLoading}
          freeSolo
          disablePortal
          id="combo-box-demo"
          options={allSkillsData || []}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Skills"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.inputProps.value && (
                      <IconButton
                        onClick={() =>
                          onSkillSelection(
                            null,
                            params.inputProps.value as string
                          )
                        }
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          onChange={onSkillSelection}
          clearOnEscape={false}
        />
        <Grid container spacing={1} direction={"row"} sx={{ mt: 2 }}>
          {selectedSkills?.map((skill) => (
            <Grid item key={skill.label}>
              <Chip
                label={skill.label}
                onDelete={handleDelete(skill)}
                color="primary"
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
        <Button type="submit" variant="contained" disabled={disableSaveBtn}>
          {loading ? <CircularProgress size={20} /> : "Save Changes"}
        </Button>
        {error && (
          <Alert severity="error" color="error">
            {error.message}
          </Alert>
        )}
      </Stack>
      <ErrSnackbar
        open={openSkillsErrBar}
        handleClose={setOpenSkillsErrBar}
        errMsg={allSkillsError?.message}
      />
    </>
  );
}

const addSkills = (skills: SkillsInput[] | undefined) => {
  if (!skills) return [];
  return skills?.map((skill) => ({ label: skill.label }));
};
