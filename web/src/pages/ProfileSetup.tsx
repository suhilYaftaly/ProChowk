import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import {
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Text from "@reusable/Text";
import CenteredStack from "@reusable/CenteredStack";
import { useUserStates } from "@/redux/reduxStates";
import { UserType, useUpdateUser } from "@gqlOps/user";
import { AddressInput } from "@gqlOps/address";
import { SkillInput } from "@gqlOps/skill";
import SkillsSelection from "@appComps/SkillsSelection";
import AddressSearch from "@appComps/AddressSearch";
import { formatToE164, navigateToUserPage } from "@/utils/utilFuncs";
import { paths } from "@/routes/Routes";
import PhoneTextField from "@appComps/PhoneTextField";
import { clientBioPlaceholder, contractorBioPlaceholder } from "@/config/data";
import { phoneCC } from "@/config/configConst";
import { isValidPhoneNumber } from "libphonenumber-js";

interface IErrors {
  userType: string;
  skills: string;
  phoneNum: string;
  address: string;
  bio: string;
}
interface IForm {
  userType: UserType;
  phoneNum?: string;
  address?: AddressInput;
  bio?: string;
  skills: SkillInput[];
}

export default function ProfileSetup() {
  const [searchParams] = useSearchParams();
  const userTypeQuery = searchParams.get("userType") as UserType | null;
  const navigate = useNavigate();
  const theme = useTheme();
  const { firstName, user } = useUserStates();
  const [form, setForm] = useState<IForm>({
    userType: userTypeQuery || "client",
    skills: [],
    phoneNum: "",
    address: undefined,
    bio: "",
  });
  const [errors, setErrors] = useState<IErrors>({
    userType: "",
    skills: "",
    phoneNum: "",
    address: "",
    bio: "",
  });
  const userTypes: UserType[] = ["client", "contractor"];
  const { updateUserAsync, loading } = useUpdateUser();

  useEffect(() => {
    if (userTypeQuery)
      setForm((prev) => ({ ...prev, userType: userTypeQuery }));
  }, [userTypeQuery]);

  const onTypeSelect = (e: SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, userType: e.target.value as UserType }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (hasErrors({ form, setErrors })) return;

    //remove userType
    const { userType, ...newForm } = form;
    if (user) {
      updateUserAsync({
        variables: {
          id: user.id,
          edits: {
            ...newForm,
            phoneNum: formatToE164(form.phoneNum),
            userTypes: [userType],
            skills: userType === "contractor" ? form.skills : [],
          },
        },
        onSuccess: (newUser) => {
          if (newUser.userTypes.length > 0 && !newUser.emailVerified) {
            navigate(paths.verifyEmail);
          } else if (newUser.userTypes.length > 0) {
            navigateToUserPage({ user, navigate });
          }
        },
      });
    }
  };

  return (
    <CenteredStack sx={{ maxWidth: 500 }} addCard>
      <Text type="subtitle" textAlign="center">
        Hey{" "}
        <span style={{ color: theme.palette.primary.main }}>{firstName}</span>{" "}
        we are almost done!
      </Text>
      <Text type="caption" sx={{ mt: 1, textAlign: "center" }}>
        Fill up below information to finish setting up your profile.
      </Text>
      <Stack
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        spacing={2}
        sx={{ mt: 4 }}
      >
        <FormControl fullWidth error={Boolean(errors.userType)}>
          <InputLabel>Sign Up as *</InputLabel>
          <Select
            value={form.userType}
            label="Sign Up as *"
            onChange={onTypeSelect}
            size="small"
            sx={{ textTransform: "capitalize" }}
            required
          >
            {userTypes.map((uType) => (
              <MenuItem
                key={uType}
                value={uType}
                sx={{ textTransform: "capitalize" }}
              >
                {uType}
              </MenuItem>
            ))}
          </Select>
          {errors.userType && (
            <FormHelperText>{errors.userType}</FormHelperText>
          )}
        </FormControl>
        <PhoneTextField
          value={form.phoneNum}
          onChange={(phoneNum) => setForm((prev) => ({ ...prev, phoneNum }))}
          helperText={errors.phoneNum}
        />
        {form.userType === "contractor" && (
          <SkillsSelection
            skills={form.skills}
            setSkills={(skills) => setForm((prev) => ({ ...prev, skills }))}
            required
            error={Boolean(errors.skills)}
            helperText={errors.skills}
          />
        )}
        <AddressSearch
          onSelect={(adr) => setForm((prev) => ({ ...prev, address: adr }))}
          address={form.address}
          label="Address"
          helperText={errors.address}
        />
        <TextField
          label={`A Bit About You (${form.bio?.length}/1000)`}
          variant="outlined"
          size="small"
          value={form.bio}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, bio: e.target.value }))
          }
          error={Boolean(errors.bio)}
          helperText={errors.bio}
          placeholder={
            form.userType === "client"
              ? clientBioPlaceholder
              : contractorBioPlaceholder
          }
          multiline={true}
          rows={6}
          inputProps={{ maxLength: 1000 }}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ borderRadius: 5 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Get Started"
          )}
        </Button>
      </Stack>
    </CenteredStack>
  );
}

interface IValidate {
  form: IForm;
  setErrors: Dispatch<SetStateAction<IErrors>>;
}
const hasErrors = ({ form, setErrors }: IValidate): boolean => {
  const isCont = form.userType === "contractor";
  let error = false;

  if (!form.userType) {
    setErrors((prev) => ({
      ...prev,
      userType: "You must select a user type.",
    }));
    error = true;
  } else setErrors((prev) => ({ ...prev, userType: "" }));

  if (form.phoneNum && !isValidPhoneNumber(form?.phoneNum, phoneCC)) {
    setErrors((prev) => ({
      ...prev,
      phoneNum: "Invalid phone number format.",
    }));
    error = true;
  } else setErrors((prev) => ({ ...prev, phoneNum: "" }));

  if (isCont && form.skills.length < 1) {
    setErrors((prev) => ({
      ...prev,
      skills: "You must select at least 1 skill.",
    }));
    error = true;
  } else setErrors((prev) => ({ ...prev, skills: "" }));

  if (isCont && (!form.address?.lat || !form.address?.lng)) {
    setErrors((prev) => ({ ...prev, address: "You must provide address." }));
    error = true;
  } else setErrors((prev) => ({ ...prev, address: "" }));

  return error;
};
