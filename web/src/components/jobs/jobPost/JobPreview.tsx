import { IJob, JobInput } from "@gqlOps/job";
import { Chip, Divider, Grid, Stack } from "@mui/material";
import { useState } from "react";

import Text from "@reusable/Text";
import JobBudgetCost from "../comps/JobBudgetCost";
import FullScreenModal from "@reusable/FullScreenModal";
import { useRespVal } from "@/utils/hooks/hooks";
import { readISODate, splitCamelCase } from "@/utils/utilFuncs";

interface Props {
  job: IJob | JobInput;
  topRightBtn?: React.ReactNode;
}
export default function JobPreview({ job, topRightBtn }: Props) {
  const { title, desc, address, budget, skills, images, startDate, endDate } =
    job;
  const [openImg, setOpenImg] = useState(false);
  const [openImgIndex, setOpenImgIndex] = useState(0);
  const fsWidth = useRespVal("100%", undefined);

  return (
    <Stack>
      <Stack
        direction={"row"}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Text type="subtitle" sx={{ mb: 2 }}>
          {title} - {address?.city} {address?.stateCode}, {address?.countryCode}
        </Text>
        {topRightBtn}
      </Stack>
      <JobBudgetCost budget={budget} sx={{ mb: 2 }} />
      <Text type="subtitle">Job Description</Text>
      <Text sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {desc}
      </Text>
      {images?.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Text type="subtitle" sx={{ mb: 1 }}>
            Job Images
          </Text>
          <Grid container spacing={1}>
            {images?.map(
              (img, i) =>
                img && (
                  <Grid item key={i} sx={{ cursor: "pointer" }}>
                    <img
                      src={`${img.url}`}
                      srcSet={`${img.url}`}
                      alt={img.name}
                      loading="lazy"
                      style={{ borderRadius: 8, height: 180 }}
                      onClick={() => {
                        setOpenImgIndex(i), setOpenImg(true);
                      }}
                    />
                  </Grid>
                )
            )}
          </Grid>
        </>
      )}
      {images?.[openImgIndex] && (
        <FullScreenModal
          title={"Job Image"}
          open={openImg}
          setOpen={setOpenImg}
        >
          <img
            src={images?.[openImgIndex].url}
            alt={images?.[openImgIndex].name}
            loading="lazy"
            style={{
              width: fsWidth,
              objectFit: "cover",
              display: "block",
              margin: "auto",
            }}
          />
        </FullScreenModal>
      )}
      {("createdAt" in job || startDate || endDate) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack direction={"row"} spacing={5}>
            {"createdAt" in job && (
              <Stack>
                <Text type="subtitle">Posted Date</Text>
                <Text>{readISODate(job?.createdAt)}</Text>
              </Stack>
            )}
            {startDate && (
              <Stack>
                <Text type="subtitle">Start Date</Text>
                <Text>{readISODate(startDate)}</Text>
              </Stack>
            )}
            {endDate && (
              <Stack>
                <Text type="subtitle">End Date</Text>
                <Text>{readISODate(endDate)}</Text>
              </Stack>
            )}
          </Stack>
        </>
      )}
      <Divider sx={{ my: 2 }} />
      <Text type="subtitle" sx={{ mb: 1 }}>
        Skills Required
      </Text>
      <Grid container spacing={1}>
        {skills?.map((skill) => (
          <Grid item key={skill.label}>
            <Chip label={skill.label} variant="outlined" />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export const JobStatus = ({ job }: { job: IJob }) => {
  const getStatusColor = () => {
    switch (job?.status) {
      case "InProgress":
        return "info";
      case "Completed":
        return "success";
      default:
        "default";
    }
    return "default";
  };

  return (
    <>
      <Text type="subtitle" sx={{ mb: 1 }}>
        Job Status
      </Text>
      <Chip
        variant="outlined"
        color={getStatusColor()}
        label={splitCamelCase(job.status)}
      />
    </>
  );
};
