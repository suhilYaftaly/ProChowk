import { Alert, Divider, Stack, TextField } from "@mui/material";
import { ChangeEvent } from "react";

import ImageUpload, { IImage, ShowImages } from "@reusable/ImageUpload";
import AddressSearch from "@appComps/AddressSearch";
import { IJobError } from "./JobForm";
import { IJob } from "@gqlOps/job";

interface Props {
  job: IJob | any;
  setJob: (job: IJob) => void;
  errors: IJobError;
  setDeletedImgId?: (id: string) => void;
}

export default function JobDetails({
  job,
  setJob,
  errors,
  setDeletedImgId,
}: Props) {
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const onAddImage = (image: IImage) => {
    if (job.images) {
      setJob({ ...job, images: [...job.images, image] });
    } else setJob({ ...job, images: [image] });
  };

  return (
    <Stack spacing={2}>
      <TextField
        label={"Project Description (max 5000 chars)"}
        variant="outlined"
        size="small"
        name={"desc"}
        value={job?.desc}
        type="number"
        onChange={onValueChange}
        placeholder={"Type your project description here..."}
        error={Boolean(errors.desc)}
        helperText={errors.desc}
        multiline
        rows={5}
        inputProps={{ maxLength: 5000 }}
        required
      />
      <AddressSearch
        onSelect={(adr) => setJob({ ...job, address: adr })}
        address={job.address}
        required
      />
      <Divider />
      <ImageUpload onImageUpload={onAddImage} />
      <Divider />
      {job.images && (
        <ShowImages
          images={job.images}
          setImages={(imgs) => setJob({ ...job, images: imgs })}
          setDeletedImgId={setDeletedImgId}
        />
      )}
      {Boolean(errors.detailsErr) && (
        <Alert severity="error" color="error">
          {errors.detailsErr}
        </Alert>
      )}
    </Stack>
  );
}
