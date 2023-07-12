import { Divider, Stack, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { IJob, IJobError } from "./PostAJob";
import ImageUpload, { IImage, ShowImages } from "@reusable/ImageUpload";

interface Props {
  job: IJob;
  setJob: Dispatch<SetStateAction<IJob>>;
  errors: IJobError;
}

export default function JobDetails({ job, setJob, errors }: Props) {
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const onAddImage = (image: IImage) => {
    setJob({ ...job, images: [...job.images, image] });
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
        rows={6}
        inputProps={{ maxLength: 5000 }}
      />
      <Divider />
      <ImageUpload onImageUpload={onAddImage} />
      <Divider />
      <ShowImages
        images={job.images}
        setImages={(imgs) => setJob({ ...job, images: imgs })}
      />
    </Stack>
  );
}
