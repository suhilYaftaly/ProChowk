import {
  ChangeEvent,
  useEffect,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { IUserInfo } from "@user/userProfile/UserInfo";
import { SkillInput } from "@gqlOps/contractor";

interface IAdInputErr {
  title: string;
  desc: string;
}
interface IServiceAd extends IAdInputErr {
  id: string;
  type: "Service" | "Job";
  skills: SkillInput[];
}
interface Props extends IUserInfo {
  ad: IServiceAd;
  setAd: Dispatch<SetStateAction<IServiceAd>>;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

export default function AddAdService({
  ad,
  setAd,
  handleSave,
  contrData,
}: Props) {
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [inputErrs, setInputErrs] = useState<IAdInputErr>({
    title: "",
    desc: "",
  });
  const [errors, setErrors] = useState({ skills: false });

  const handleAdChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setDisableSaveBtn(false);
    setAd({ ...ad, [name]: value });
    setInputErrs((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(value, name as keyof IServiceAd),
    }));
  };

  const validateField = (value: string, fieldName: keyof IServiceAd) => {
    let error = "";

    switch (fieldName) {
      case "title":
      case "desc":
        if (value.length < 3) {
          error = `${fieldName} should have at least 3 characters`;
        }
        break;
      default:
        break;
    }

    return error;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    let error = false;
    e.preventDefault();

    const fieldNames: (keyof IAdInputErr)[] = Object.keys(
      ad
    ) as (keyof IAdInputErr)[];
    const newInputErr: Partial<IAdInputErr> = {};
    const inputHasErr = Object.values(newInputErr).some((error) =>
      Boolean(error)
    );
    const hasEmptyFields = Object.values(ad).some((v) => v === "");

    fieldNames.forEach((fieldName) => {
      const error = validateField(ad[fieldName], fieldName);
      if (error) newInputErr[fieldName] = error;
    });

    setInputErrs((pr) => ({ ...pr, ...newInputErr }));

    if (ad?.skills?.length < 1) {
      error = true;
      setErrors((pv) => ({ ...pv, skills: true }));
    }

    if (error || inputHasErr || hasEmptyFields) {
      setDisableSaveBtn(true);
      return;
    } else handleSave(e);
  };

  const onSkillAdd = (newSkill: SkillInput) => {
    const exists = ad.skills?.some((s) => s.label === newSkill.label);
    if (!exists) {
      setAd((pv) => ({ ...pv, skills: [...pv.skills, newSkill] }));
      setDisableSaveBtn(false);
    }
    setErrors((pv) => ({ ...pv, skills: false }));
  };
  const onSkillDelete = (skillToDelete: SkillInput) => () => {
    setDisableSaveBtn(false);
    setAd((pv) => ({
      ...pv,
      skills: pv.skills?.filter((skill) => skill.label !== skillToDelete.label),
    }));
  };

  return (
    <Stack
      component="form"
      sx={{ mt: 2 }}
      spacing={2}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <TextField
        label={"Title"}
        variant="outlined"
        size="small"
        name={"title"}
        value={ad.title}
        onChange={handleAdChange}
        placeholder={"ad title"}
        error={Boolean(inputErrs.title)}
        helperText={inputErrs.title}
        autoFocus
      />
      <TextField
        label={"Description"}
        variant="outlined"
        size="small"
        name={"desc"}
        value={ad.desc}
        onChange={handleAdChange}
        placeholder={"ad description"}
        error={Boolean(inputErrs.desc)}
        helperText={inputErrs.desc}
      />
      <div>
        <Divider sx={{ my: 2 }} />
      </div>
      <Typography>
        Select your skills which will be used for this service
      </Typography>
      <div>
        <Grid container spacing={1} direction={"row"}>
          {contrData?.skills?.map((skill) => (
            <Grid item key={skill.label}>
              <Chip
                label={skill.label}
                color="primary"
                variant="outlined"
                icon={<AddIcon />}
                clickable
                onClick={() => onSkillAdd(skill)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <Divider />
      <Typography>
        {ad.skills?.length > 0
          ? "Your selected skills"
          : "Select skills from above to add to your service AD"}
      </Typography>
      <div>
        <Grid container spacing={1} direction={"row"}>
          {ad.skills?.map((skill) => (
            <Grid item key={skill.label}>
              <Chip
                label={skill.label}
                onDelete={onSkillDelete(skill)}
                color="primary"
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </div>

      <Button type="submit" variant="contained" disabled={disableSaveBtn}>
        {false ? <CircularProgress size={20} /> : "Save Changes"}
      </Button>
      {errors.skills && (
        <Alert severity="error" color="error">
          You must add atleast one skill to your AD
        </Alert>
      )}
      {/* {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )} */}
    </Stack>
  );
}
