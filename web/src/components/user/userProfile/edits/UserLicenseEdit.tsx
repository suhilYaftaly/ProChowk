import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";

import {
  IContractor,
  LicenseInput,
  useAddContractorLicense,
} from "@gqlOps/contractor";
import ImageUpload, { IImage, ShowImages } from "@reusable/ImageUpload";
import { charsCount } from "@/utils/utilFuncs";

interface Props {
  onClose: () => void;
  contractor: IContractor;
}
export default function UserLicenseEdit({ contractor, onClose }: Props) {
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const { addContLicAsync, loading } = useAddContractorLicense();
  const defaults = { name: "", size: 0, type: "", url: "", desc: "" };
  const [license, setLicense] = useState<LicenseInput>(defaults);
  const [errors, setErrors] = useState<IFormErrs>({
    url: "",
    name: "",
    desc: "",
  });

  const onLicenseUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm({ license, setErrors })) return;
    setDisableSaveBtn(true);

    if (contractor?.id) {
      addContLicAsync({
        variables: { license, contId: contractor.id },
        onSuccess: () => {
          toast.success("Profile updated successfully!", {
            position: "bottom-right",
          });
          onClose();
        },
      });
    }
  };

  const onImagesChange = (images: IImage[]) => {
    setDisableSaveBtn(false);
    const image = images[0];
    setLicense(image?.url ? image : defaults);
  };

  const handleFDataChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setDisableSaveBtn(false);
    setLicense((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Stack component={"form"} onSubmit={onLicenseUpload} spacing={2}>
      {license?.url && (
        <>
          <TextField
            label={"Name"}
            variant="outlined"
            size="small"
            name={"name"}
            value={license.name}
            onChange={handleFDataChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            placeholder={"license name"}
            required
          />
          <TextField
            label={`Description ${charsCount(license.desc, 200)}`}
            variant="outlined"
            size="small"
            name={"desc"}
            value={license.desc}
            onChange={handleFDataChange}
            error={Boolean(errors.desc)}
            helperText={errors.desc}
            placeholder={
              "Include any special notes or conditions of the license"
            }
            multiline={true}
            rows={3}
            inputProps={{ maxLength: 200 }}
          />
        </>
      )}
      <ImageUpload
        onImageUpload={onImagesChange}
        allowMultiple={false}
        helperText={errors.url}
      />
      {license.url && (
        <ShowImages images={[license]} setImages={onImagesChange} />
      )}
      <div>
        <Button
          variant="contained"
          disabled={disableSaveBtn}
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Stack>
  );
}

interface IFormErrs {
  url: string;
  name: string;
  desc: string;
}
interface IValidateProps {
  license: LicenseInput;
  setErrors: React.Dispatch<React.SetStateAction<IFormErrs>>;
}
/**sets the errors and returns hasErrors @returns hasErrors as boolean */
const validateForm = ({ license, setErrors }: IValidateProps) => {
  let hasError = false;
  let formErrs: IFormErrs = { url: "", name: "", desc: "" };

  if (!license.url) {
    formErrs.url = "License file must be added.";
    hasError = true;
  }
  if (license.name?.length < 1) {
    formErrs.name = "License name must be filled.";
    hasError = true;
  }

  setErrors(formErrs);
  return hasError;
};
