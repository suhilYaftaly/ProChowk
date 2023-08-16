import {
  Box,
  Chip,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { IJob } from "@gqlOps/job";
import { convertUnixToDate } from "@utils/utilFuncs";
import { useRespVal } from "@utils/hooks/hooks";
import FullScreenModal from "@reusable/FullScreenModal";
import QRCodeModal from "@/components/reusable/QRCodeModal";
import { jobLink } from "@/constants/links";

interface Props {
  job: IJob | undefined;
  loading: boolean;
  userId: string | undefined;
}

export default function DetailsSection({ job, loading, userId }: Props) {
  const [activeImg, setActiveImg] = useState(job?.images?.[0]);
  const [openFullImg, setOpenFullImg] = useState(false);
  const fsWidth = useRespVal("100%", undefined);

  const leftTxts = [
    {
      label: "Location",
      txt: `${job?.address?.city} ${job?.address?.stateCode}, ${job?.address?.countryCode}`,
    },
    { label: "Job Type / Size", txt: `${job?.budget.type} / ${job?.jobSize}` },
  ];
  const rightTxts = [
    {
      label: "Posted At",
      txt: convertUnixToDate(job?.createdAt)?.monthDayYear,
    },
    {
      label: "Pay Rate",
      txt: `$${job?.budget.from}-$${job?.budget.to}
      ${
        job?.budget.type === "Hourly" ? ` / Max ${job?.budget.maxHours}Hrs` : ""
      }`,
    },
  ];

  return (
    <>
      <Stack spacing={1}>
        {loading ? (
          <>
            <Skeleton variant="text" width={350} />
            <Skeleton variant="text" width={350} />
            <Skeleton variant="text" width={350} />
          </>
        ) : (
          <>
            <Stack
              direction={"row"}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography variant="h5" sx={{ mr: 2 }}>
                {job?.title}
              </Typography>
              {userId && job?.id && (
                <QRCodeModal
                  modalTitle="Job QR Code."
                  description="Share this QR code with anyone so they can view this job."
                  fileName={job?.title}
                  value={jobLink(userId, job?.id)}
                  qrIconSize={30}
                />
              )}
            </Stack>
            <Stack
              direction={"row"}
              sx={{
                border: "1px solid grey",
                borderRadius: 2,
                p: 2,
                justifyContent: "space-evenly",
              }}
            >
              <BoxSection data={leftTxts} />
              <BoxSection data={rightTxts} />
            </Stack>
            <div>
              <Divider sx={{ my: 2 }} />
            </div>
            <Typography variant="h5">Required Skills</Typography>
            <div>
              <Grid container spacing={1}>
                {job?.skills?.map((skill) => (
                  <Grid item key={skill.label}>
                    <Chip label={skill.label} variant="filled" size="small" />
                  </Grid>
                ))}
              </Grid>
            </div>
            {job?.images && job?.images?.length > 0 && (
              <>
                <div>
                  <Divider sx={{ my: 2 }} />
                </div>
                <Box
                  sx={{
                    maxHeight: 600,
                    overflowY: "auto",
                    border: "1px solid grey",
                    borderRadius: 2,
                  }}
                >
                  <ImageList variant="masonry" cols={2} gap={8}>
                    {job.images.map((img) => (
                      <ImageListItem
                        key={img.id}
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setActiveImg(img);
                          setOpenFullImg(true);
                        }}
                      >
                        <img
                          src={`${img.url}`}
                          srcSet={`${img.url}`}
                          alt={img.name}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </>
            )}
            <div>
              <Divider sx={{ my: 2 }} />
            </div>
            <Typography variant="h5">Job Description</Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {job?.desc}
            </Typography>
          </>
        )}
      </Stack>

      {activeImg && (
        <FullScreenModal
          title={"Job Image"}
          open={openFullImg}
          setOpen={setOpenFullImg}
        >
          <img
            src={activeImg.url}
            alt={activeImg.name}
            loading="lazy"
            style={{ width: fsWidth, objectFit: "cover" }}
          />
        </FullScreenModal>
      )}
    </>
  );
}

interface IBoxSection {
  data: { label: string; txt: string | any }[];
}
const BoxSection = ({ data }: IBoxSection) => {
  return (
    <Stack spacing={2}>
      {data.map((i) => (
        <Stack key={i.label} direction={useRespVal("column", "row")}>
          <Typography sx={{ mr: 1, fontWeight: "550" }}>{i.label}</Typography>
          <Typography>{i.txt}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};
