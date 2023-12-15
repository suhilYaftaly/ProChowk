import { Grid, Skeleton, Stack } from "@mui/material";
import { useState } from "react";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";
import FullScreenModal from "@reusable/FullScreenModal";
import { useRespVal } from "@hooks/hooks";

export default function UserLicences({
  contractor,
  p,
  tmb,
  contrLoading,
}: ISectionProps) {
  const licences = contractor?.licenses;
  const [openImg, setOpenImg] = useState(false);
  const [openImgIndex, setOpenImgIndex] = useState(0);
  const fsWidth = useRespVal("100%", undefined);

  if (contrLoading) return <LicenseSkeleton p={p} />;
  return (
    <Stack sx={{ p }}>
      <Text type="subtitle">
        Licences/Certificates ({licences?.length || "0"})
      </Text>
      <Grid container spacing={1} direction={"row"} sx={{ mt: tmb }}>
        {licences?.map((li, i) => (
          <Grid
            item
            key={li.id}
            sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
            onClick={() => {
              setOpenImgIndex(i), setOpenImg(true);
            }}
          >
            <img
              src={li.url}
              alt={li.name}
              loading="lazy"
              style={{ height: 130, borderRadius: 8 }}
            />
            <Text>{li.desc}</Text>
          </Grid>
        ))}
      </Grid>
      {licences?.[openImgIndex] && (
        <FullScreenModal
          title={"Job Image"}
          open={openImg}
          setOpen={setOpenImg}
        >
          <img
            src={licences?.[openImgIndex].url}
            alt={licences?.[openImgIndex].name}
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
    </Stack>
  );
}

interface SProps {
  p: number;
}
const LicenseSkeleton = ({ p }: SProps) => {
  return (
    <Stack sx={{ p }}>
      <Skeleton variant="text" sx={{ width: 100, mb: 2 }} />
      <Stack direction={"row"} spacing={2}>
        <Stack>
          <Skeleton variant="rounded" sx={{ width: 200, height: 150 }} />
          <Skeleton variant="text" width={100} />
        </Stack>
        <Stack>
          <Skeleton variant="rounded" sx={{ width: 200, height: 150 }} />
          <Skeleton variant="text" width={100} />
        </Stack>
      </Stack>
    </Stack>
  );
};
