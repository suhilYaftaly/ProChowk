import { TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

import Text from "@reusable/Text";
import ImageUpload, { IImage, ShowImages } from "@reusable/ImageUpload";
import { estimateBase64Size, formatBytes } from "@/utils/utilFuncs";
import { jobConfigs } from "@/config/configConst";
import { IJobSteps } from "./JobForm";
import AddressSearch from "@appComps/AddressSearch";

const {
  validations: { maxDesc, maxImgsSize },
} = jobConfigs;
const mb = 1;
const mt = 3;

export default function JobDescription({
  jobForm,
  setJobForm,
  errors,
}: IJobSteps) {
  const [imgsTotalSize, setImgsTotalSize] = useState(0);

  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAddNewImages = (images: IImage[]) => {
    const newTotalSize = images.reduce(
      (acc, img) => acc + estimateBase64Size(img.url),
      imgsTotalSize
    );

    // 20MB in bytes
    if (newTotalSize <= maxImgsSize * 1024 * 1024) {
      setJobForm((prev) => ({ ...prev, images: [...prev.images, ...images] }));
      setImgsTotalSize(newTotalSize);
    } else toast.error(exceededTotalImgSizeMsg);
  };

  const onEditAllImages = (images: IImage[]) => {
    const newTotalSize = images.reduce(
      (acc, img) => acc + estimateBase64Size(img.url),
      0
    );

    // 15MB in bytes
    if (newTotalSize <= maxImgsSize * 1024 * 1024) {
      setJobForm((prev) => ({ ...prev, images }));
      setImgsTotalSize(newTotalSize);
    } else toast.error(exceededTotalImgSizeMsg);
  };

  return (
    <>
      <Text type="subtitle">Location</Text>
      <Text sx={{ mb: 2 }}>
        We will match you with the right candidate from this area.
      </Text>
      <AddressSearch
        onSelect={(adr) => setJobForm((prev) => ({ ...prev, address: adr }))}
        address={jobForm.address}
        label=""
        required
        helperText={errors.address}
      />
      <Text type="subtitle" sx={{ mb, mt }}>
        Project Description ({maxDesc - jobForm.desc.length}/{maxDesc})
      </Text>
      <TextField
        variant="outlined"
        size="small"
        name={"desc"}
        value={jobForm.desc}
        onChange={onValueChange}
        placeholder={descPlaceholder}
        error={Boolean(errors.desc)}
        helperText={errors.desc}
        required
        multiline
        rows={4}
        inputProps={{ maxLength: maxDesc }}
        sx={{ mb: mt }}
      />
      <ImageUpload
        onImageUpload={onAddNewImages}
        caption={`${formatBytes(imgsTotalSize)} of Max ${maxImgsSize} MB total`}
        helperText={errors.images}
      />
      {jobForm.images && (
        <ShowImages
          images={jobForm.images}
          setImages={onEditAllImages}
          gridContSX={{ mt: mb }}
          //   setDeletedImgId={setDeletedImgId}
        />
      )}
    </>
  );
}

const exceededTotalImgSizeMsg = `Total image size exceeds the ${maxImgsSize}MB limit. Please upload smaller images.`;
const descPlaceholder =
  "Example: Renovating kitchen and master bathroom. Looking for a modern style with energy-efficient appliances and fixtures. Kitchen size is approx. 300 sq ft. Interested in quartz countertops and hardwood flooring. Planning to start in early May with a budget around $20,000.";
