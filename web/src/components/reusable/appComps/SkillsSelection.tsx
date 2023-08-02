import { Autocomplete, TextField, IconButton, Chip, Grid } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import ErrSnackbar from "../ErrSnackbar";
import { SkillInput, useSkills } from "@gqlOps/skill";

interface Props {
  skills: SkillInput[] | undefined;
  setSkills: (skills: SkillInput[]) => void;
  setNewSkills?: Dispatch<SetStateAction<SkillInput[]>>;
}

export default function SkillsSelection({
  skills,
  setSkills,
  setNewSkills,
}: Props) {
  const [openErrBar, setOpenErrBar] = useState(false);
  const {
    skillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
    error: allSkillsError,
  } = useSkills();
  const allSkillsData = allSkillsType?.skills;

  const handleAdd = (newSkill: SkillInput) => {
    const exists = skills?.some((s) => s.label === newSkill.label);
    if (!exists) {
      //create new skills list to add to backend allSkills
      const existsInAllSkills = allSkillsData?.some(
        (s) => s.label === newSkill.label
      );
      if (!existsInAllSkills && setNewSkills)
        setNewSkills((pv) => [...pv, newSkill]);

      setSkills(skills ? [...skills, newSkill] : [newSkill]);
    }
  };
  const handleDelete = (skillToDelete: SkillInput) => () => {
    if (skills) {
      setSkills(skills?.filter((skill) => skill.label !== skillToDelete.label));
      if (setNewSkills) {
        setNewSkills((skills) =>
          skills?.filter((skill) => skill.label !== skillToDelete.label)
        );
      }
    }
  };

  const onSkillSelection = (_: any, value: SkillInput | null | string) => {
    if (value && typeof value === "string") {
      const newSkill = { label: value };
      handleAdd(newSkill);
    } else if (value && typeof value !== "string") {
      const newSkill = { label: value.label };
      handleAdd(newSkill);
    }
  };

  return (
    <div>
      <Autocomplete
        onOpen={() => skillsAsync({})}
        loading={allSkillsLoading}
        freeSolo
        disablePortal
        options={allSkillsData || []}
        onChange={onSkillSelection}
        size="small"
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
      />

      <Grid container spacing={1} direction={"row"} sx={{ mt: 0, mb: 1 }}>
        {skills?.map((skill) => (
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

      <ErrSnackbar
        open={openErrBar}
        handleClose={setOpenErrBar}
        errMsg={allSkillsError?.message}
      />
    </div>
  );
}

export const addSkills = (skills: SkillInput[] | undefined) => {
  if (!skills) return [];
  return skills?.map((skill) => ({ label: skill.label }));
};
