import {
  ChangeEvent,
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
import RemoveIcon from "@mui/icons-material/Remove";

import { IUserInfo } from "@user/userProfile/UserInfo";
import { IAdSkill } from "../Ads";

interface IServiceAd {
  id: string;
  title: string;
  desc: string;
  type: "Service" | "Job";
  skills: IAdSkill[];
}
interface Props extends IUserInfo {
  ad: IServiceAd;
  setAd: Dispatch<SetStateAction<IServiceAd>>;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

export default function AddAdService({ ad, setAd, handleSave }: Props) {
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [errors, setErrors] = useState(resetErr);

  const handleAdChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableSaveBtn(false);
    setAd({ ...ad, [name]: value });
  };

  const validateFields = (): boolean => {
    let err = false;

    setErrors(resetErr);

    if (ad?.title?.length < 3) {
      err = true;
      setErrors((pv) => ({ ...pv, title: "Must have more than 3 chars" }));
    }
    if (ad?.desc?.length < 9) {
      err = true;
      setErrors((pv) => ({ ...pv, desc: "Must have more than 9 chars" }));
    }
    if (ad.skills?.length < 1 || ad.skills.every((skill) => !skill.selected)) {
      err = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: "You must add at least one skill",
      }));
    }

    return err;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateFields();

    if (error) {
      setDisableSaveBtn(true);
      return;
    } else handleSave(e);
  };

  const onSkillClick = (i: number) => {
    setDisableSaveBtn(false);
    const newSkills = [...ad.skills];
    newSkills[i] = { ...newSkills[i], selected: !newSkills[i].selected };

    setAd({ ...ad, skills: newSkills });
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
        error={Boolean(errors.title)}
        helperText={errors.title}
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
        error={Boolean(errors.desc)}
        helperText={errors.desc}
        multiline={true}
        rows={4}
      />
      <div>
        <Divider sx={{ my: 2 }} />
      </div>
      <Typography>
        Select your skills which will be used for this service
      </Typography>
      <div>
        <Grid container spacing={1} direction={"row"}>
          {ad?.skills?.map((skill, index) => (
            <Grid item key={skill.label}>
              <Chip
                label={skill.label}
                color="primary"
                variant={skill.selected ? "filled" : "outlined"}
                icon={skill.selected ? <RemoveIcon /> : <AddIcon />}
                clickable
                onClick={() => onSkillClick(index)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <Button type="submit" variant="contained" disabled={disableSaveBtn}>
        {false ? <CircularProgress size={20} /> : "Save Changes"}
      </Button>
      {Boolean(errors.skills) && (
        <Alert severity="error" color="error">
          {errors.skills}
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

const resetErr = { title: "", desc: "", skills: "" };
