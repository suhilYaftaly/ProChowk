import { JobInput } from "@gqlOps/job";
import { Chip, Divider, Grid, Stack } from "@mui/material";
import { useState } from "react";

import Text from "@reusable/Text";
import JobBudgetCost from "../comps/JobBudgetCost";
import FullScreenModal from "@reusable/FullScreenModal";
import { useRespVal } from "@/utils/hooks/hooks";
import { readISODate } from "@/utils/utilFuncs";

interface Props {
  job: JobInput;
}
export default function JobPreview({ job }: Props) {
  const { title, desc, address, budget, skills, materials, images } = job;
  const combinedMaterials = materials?.join(", ");
  const [openImg, setOpenImg] = useState(false);
  const [openImgIndex, setOpenImgIndex] = useState(0);
  const fsWidth = useRespVal("100%", undefined);

  return (
    <Stack>
      <Text type="title" sx={{ mb: 2 }}>
        {title} - {address?.city} {address?.stateCode}, {address?.countryCode}
      </Text>
      <JobBudgetCost budget={budget} />
      <Text type="subtitle" sx={{ mt: 1 }}>
        Job Description
      </Text>
      <Text sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {desc}
      </Text>
      {combinedMaterials && (
        <>
          <Divider sx={{ my: 2 }} />
          <Text type="subtitle" sx={{}}>
            Required Materials
          </Text>
          <Text>{combinedMaterials} (Contractor has to carry these items)</Text>
        </>
      )}
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
      <Divider sx={{ my: 2 }} />
      <Text type="subtitle">Posted Date</Text>
      <Text>{readISODate(new Date().toISOString())}</Text>
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
