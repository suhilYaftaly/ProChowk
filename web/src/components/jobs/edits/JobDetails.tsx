import { Alert, Divider, Stack, TextField } from "@mui/material";
import { ChangeEvent } from "react";

import ImageUpload, { IImage, ShowImages } from "@reusable/ImageUpload";
import AddressSearch from "@appComps/AddressSearch";
import { IAddressData } from "@gqlOps/address";
import { IJobError } from "./JobForm";
import { JobInput } from "@gqlOps/jobs";

interface Props {
  job: JobInput;
  setJob: (job: JobInput) => void;
  errors: IJobError;
}

export default function JobDetails({ job, setJob, errors }: Props) {
  const onValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const onAddImage = (image: IImage) => {
    if (job.images) {
      setJob({ ...job, images: [...job.images, image] });
    } else setJob({ ...job, images: [image] });
  };

  const onAddressSelect = (adr: IAddressData) => {
    setJob({
      ...job,
      address: {
        displayName: adr.displayName,
        street: adr.street,
        city: adr.city,
        county: adr.county,
        state: adr.state,
        stateCode: adr.stateCode,
        postalCode: adr.postalCode,
        country: adr.country,
        countryCode: adr.countryCode,
        lat: adr.lat,
        lng: adr.lng,
      },
    });
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
      />
      <AddressSearch onSelect={onAddressSelect} address={job.address} />
      <Divider />
      <ImageUpload onImageUpload={onAddImage} />
      <Divider />
      {job.images && (
        <ShowImages
          images={job.images}
          setImages={(imgs) => setJob({ ...job, images: imgs })}
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
