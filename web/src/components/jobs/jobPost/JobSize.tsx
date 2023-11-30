import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
} from "@mui/material";
import { ChangeEvent } from "react";

import { JobInput } from "@gqlOps/job";
import Text from "@reusable/Text";
import AddressSearch from "@reusable/appComps/AddressSearch";
import { IJobSteps } from "@pages/JobPost";

export default function JobSize({ jobForm, setJobForm, errors }: IJobSteps) {
  const theme = useTheme();
  const darkTxColor = theme.palette.text.dark;
  const jobSizes: JobInput["jobSize"][] = ["Large", "Medium", "Small"];
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jobSize = (event.target as HTMLInputElement)
      .value as JobInput["jobSize"];
    setJobForm((prev) => ({ ...prev, jobSize }));
  };

  return (
    <>
      <Text type="subtitle">Job size (Estimate the size of your work)</Text>
      <Text sx={{ mb: 2 }}>
        We will match you with the right candidate who is an expert on your job
        size.
      </Text>
      <FormControl>
        <RadioGroup value={jobForm.jobSize} onChange={handleChange}>
          {jobSizes.map((jSize) => {
            const isChecked = jobForm.jobSize === jSize;
            return (
              <FormControlLabel
                key={jSize}
                value={jSize}
                control={<Radio />}
                label={jSize}
                componentsProps={{
                  typography: {
                    color: darkTxColor,
                    fontWeight: isChecked ? "600" : undefined,
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      <Text type="subtitle" sx={{ mt: 4 }}>
        Location
      </Text>
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
    </>
  );
}
