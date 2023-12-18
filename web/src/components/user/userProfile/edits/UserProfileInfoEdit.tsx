import {
  Avatar,
  Button,
  Stack,
  useTheme,
  Card,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { toast } from "react-toastify";

import { IUpdateUserInput, IUser, useUpdateUser } from "@gqlOps/user";
import { ImageInput } from "@/types/commonTypes";
import {
  formatPhoneNumber,
  formatToE164,
  processImageFile,
} from "@/utils/utilFuncs";
import AddressSearch, { getAddressFormat } from "@appComps/AddressSearch";
import PhoneTextField from "@appComps/PhoneTextField";
import { phoneCC } from "@/config/configConst";

interface Props {
  onClose: () => void;
  user: IUser;
}
export default function UserProfileInfoEdit({ user, onClose }: Props) {
  const theme = useTheme();
  const paperC = theme.palette.background.paper;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUserAsync, loading: updLoading } = useUpdateUser();
  const [isImgChanged, setIsImgChanged] = useState(false);

  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [form, setForm] = useState({
    image: user?.image,
    name: user.name,
    phoneNum: formatPhoneNumber(user?.phoneNum),
    bio: user?.bio,
    address: user?.address ? getAddressFormat(user?.address) : undefined,
  });
  const [formErr, setFormErr] = useState<IFormErrs>({
    name: "",
    phoneNum: "",
  });

  const triggerFileInput = () => fileInputRef.current?.click();
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { imageUrl, fileSize } = await processImageFile({
        file,
        maxSize: 400,
      });

      const image: ImageInput = {
        url: imageUrl,
        name: file.name,
        size: fileSize,
        type: file.type,
      };
      CH(() => setForm({ ...form, image }));
      setIsImgChanged(true);
    }
  };

  const handleFDataChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setDisableSaveBtn(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**changeHandler */
  const CH = (action: () => void) => {
    setDisableSaveBtn(false);
    action();
  };

  const handleSaveChanges = () => {
    if (validateForm({ form, setFormErr })) return;
    setDisableSaveBtn(true);

    if (user) {
      const phoneNum = formatToE164(form.phoneNum);
      const image = isImgChanged ? form.image : undefined;
      const updateData = {
        id: user.id,
        edits: { name: form.name, phoneNum, address: form.address, image },
      };

      updateUserAsync({
        variables: updateData,
        onSuccess: () => {
          toast.success("Profile updated successfully!", {
            position: "bottom-right",
          });
          onClose();
        },
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action of the enter key
      handleSaveChanges(); // Calls the same function as your button's onClick
    }
  };

  return (
    <Stack onKeyDown={handleKeyPress}>
      <Stack alignItems={"center"}>
        <Stack alignItems={"center"} sx={{ mb: -18 }}>
          <Avatar
            alt={form?.name}
            src={form?.image?.url}
            sx={{
              width: 120,
              height: 120,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
            onClick={triggerFileInput}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2, backgroundColor: paperC }}
            onClick={triggerFileInput}
          >
            Update Profile Picture
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Stack>
        <PatternedBackdrop />
      </Stack>
      <Stack component="form" sx={{ my: 3 }} spacing={3}>
        <TextField
          label={"Name"}
          variant="outlined"
          size="small"
          name={"name"}
          value={form.name}
          onChange={handleFDataChange}
          error={Boolean(formErr.name)}
          helperText={formErr.name}
          placeholder={"your name"}
          required
        />
        <TextField
          label={"Email"}
          variant="outlined"
          size="small"
          name={"email"}
          value={user.email}
          disabled
        />
        <PhoneTextField
          value={form.phoneNum}
          onChange={(phoneNum) =>
            CH(() => setForm((prev) => ({ ...prev, phoneNum })))
          }
          helperText={formErr.phoneNum}
        />
      </Stack>
      <AddressSearch
        onSelect={(address) =>
          CH(() => setForm((prev) => ({ ...prev, address })))
        }
        address={form.address}
        label="Address"
      />
      <Button
        variant="contained"
        disabled={disableSaveBtn}
        sx={{ mt: 4 }}
        onClick={handleSaveChanges}
      >
        {updLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </Stack>
  );
}

interface IFormErrs {
  name: string;
  phoneNum: string;
}
interface IValidateProps {
  form: IUpdateUserInput;
  setFormErr: Dispatch<SetStateAction<IFormErrs>>;
}
/**sets the errors and returns hasErrors @returns hasErrors as boolean */
const validateForm = ({ form, setFormErr }: IValidateProps) => {
  let hasError = false;
  let formErrs: IFormErrs = {
    name: "",
    phoneNum: "",
  };

  if (form?.name && form.name?.length < 2) {
    formErrs.name = "Name must be more than 2 characters";
    hasError = true;
  }

  if (form?.phoneNum && !isValidPhoneNumber(form?.phoneNum, phoneCC)) {
    formErrs.phoneNum =
      "Invalid phone number format, format must be in (999-999-9999) format";
    hasError = true;
  }

  setFormErr(formErrs);
  return hasError;
};

const PatternedBackdrop = () => {
  const theme = useTheme();
  const radialGradient = `radial-gradient(circle at center, ${theme.palette.grey[400]} 1px, transparent 0)`;
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        height: 170,
        borderRadius: 2,
        background: `${radialGradient}, ${radialGradient}`,
        backgroundSize: "20px 20px", // Adjust the size of the dots and spacing
      }}
    />
  );
};
