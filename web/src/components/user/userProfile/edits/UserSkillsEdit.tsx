import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import contOps, {
  IContrSkills,
  ISearchContrProfData,
  ISearchContrProfInput,
  IUpdateContrProfData,
  IUpdateContrProfInput,
} from "@gqlOps/contractor";

interface Props {
  userSkills: IContrSkills[] | undefined;
  userId: string | undefined;
  closeEdit: () => void;
}

export default function UserSkillsEdit({
  userSkills,
  userId,
  closeEdit,
}: Props) {
  const client = useApolloClient();
  const [selectedSkills, setSelectedSkills] = useState(addSkills(userSkills));
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [updateContrProf, { error, loading }] = useMutation<
    IUpdateContrProfData,
    IUpdateContrProfInput
  >(contOps.Mutations.updateContrProf);
  const [searchContrProf] = useLazyQuery<
    ISearchContrProfData,
    ISearchContrProfInput
  >(contOps.Queries.searchContrProf);

  useEffect(() => setSelectedSkills(addSkills(userSkills)), [userSkills]);

  const updateUserData = async () => {
    try {
      const { data } = await updateContrProf({
        variables: { skills: selectedSkills },
      });
      if (data?.updateContrProf && userId) {
        const cachedData = client.readQuery<
          ISearchContrProfData,
          ISearchContrProfInput
        >({
          query: contOps.Queries.searchContrProf,
          variables: { userId },
        });

        if (cachedData) {
          const modifiedData = {
            ...cachedData,
            skills: data.updateContrProf?.skills,
          };

          client.writeQuery<ISearchContrProfData, ISearchContrProfInput>({
            query: contOps.Queries.searchContrProf,
            data: modifiedData,
            variables: { userId },
          });
        } else {
          const { data: searchUserData } = await searchContrProf({
            variables: { userId },
          });
          if (!searchUserData?.searchContrProf) throw new Error();
        }

        closeEdit();
      } else throw new Error();
    } catch (error: any) {
      console.log("user update failed:", error.message);
    }
  };

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    //TODO

    // delete (newData.address as any).__typename;
    updateUserData();
    setDisableSaveBtn(true);
  };
  const handleAdd = (newSkill: IContrSkills) => {
    const exists = selectedSkills?.some((s) => s.id === newSkill.id);
    if (!exists) {
      setSelectedSkills((pv) => pv && [...pv, newSkill]);
      setDisableSaveBtn(false);
    }
  };
  const handleDelete = (skillToDelete: IContrSkills) => () => {
    setDisableSaveBtn(false);
    setSelectedSkills((skills) =>
      skills?.filter((skill) => skill.id !== skillToDelete.id)
    );
  };
  const onSkillSelection = (_: any, value: IContrSkills | null | string) => {
    if (value && typeof value !== "string") handleAdd(value);
  };

  return (
    <Stack
      component="form"
      sx={{ pt: 3, pb: 1, overflow: "hidden" }}
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={handleSave}
    >
      <Autocomplete
        freeSolo
        disablePortal
        id="combo-box-demo"
        options={allJobsList}
        renderInput={(params) => <TextField {...params} label="Skills" />}
        onChange={onSkillSelection}
      />

      <Grid container spacing={1} direction={"row"} sx={{ mt: 2 }}>
        {selectedSkills?.map((skill) => (
          <Grid item key={skill.id}>
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
  );
}

const addSkills = (skills: IContrSkills[] | undefined) => {
  if (!skills) return [];
  return skills?.map((skill) => ({ id: skill.id, label: skill.label }));
};

const allJobsList: readonly IContrSkills[] = [
  { id: "0", label: "Floaring" },
  { id: "1", label: "Carpentry" },
  { id: "2", label: "Framing" },
  { id: "3", label: "Plumbing" },
  { id: "4", label: "Landscaping" },
  { id: "5", label: "Interlocking & Driveway" },
  { id: "6", label: "Basement" },
  { id: "7", label: "Kitchen" },
  { id: "8", label: "Painting" },
  { id: "9", label: "Garage Door" },
  { id: "10", label: "Appliance Repair & Installation" },
  { id: "11", label: "Windown & Doors" },
  { id: "12", label: "Roofing" },
  { id: "13", label: "Electircian" },
  { id: "14", label: "Heating & Air Conditioning" },
];
