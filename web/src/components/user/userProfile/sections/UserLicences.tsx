import { Grid, Skeleton, Stack, useTheme } from "@mui/material";
import { useState } from "react";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";
import FullScreenModal from "@reusable/FullScreenModal";
import { useIsMobile, useRespVal } from "@hooks/hooks";
import EditableTitle from "../edits/EditableTitle";
import CustomModal from "@reusable/CustomModal";
import UserLicenseEdit from "../edits/license/UserLicenseEdit";
import SwipeableView from "@reusable/SwipeableView";

export default function UserLicences({
  contractor,
  p,
  tmb,
  contrLoading,
  isMyProfile,
}: ISectionProps) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const licences = contractor?.licenses;
  const [openImg, setOpenImg] = useState(false);
  const [openImgIndex, setOpenImgIndex] = useState(0);
  const fsWidth = useRespVal("100%", undefined);
  const [openEdit, setOpenEdit] = useState(false);

  const selectedLicense = licences?.[openImgIndex];

  const mobileCards = () => {
    return (
      <>
        {contrLoading ? (
          <MobileLicenseSkeleton />
        ) : (
          licences && (
            <SwipeableView
              items={licences.map((li, i) => (
                <Stack
                  key={li.id}
                  onClick={() => {
                    setOpenImgIndex(i), setOpenImg(true);
                  }}
                >
                  <Stack
                    sx={{
                      borderRadius: 2,
                      backgroundColor: theme.palette.secondary.light,
                    }}
                  >
                    <img
                      src={li.url}
                      alt={li.name}
                      loading="lazy"
                      style={{
                        height: 200,
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </Stack>
                  <Text sx={{ mb: 5 }}>{li.name}</Text>
                </Stack>
              ))}
            />
          )
        )}
      </>
    );
  };

  const desktopCards = () => (
    <Grid container spacing={1} direction={"row"}>
      {contrLoading ? (
        <LicensesSkeleton />
      ) : (
        licences?.map((li, i) => (
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
            <Text width={100}>{li.name}</Text>
          </Grid>
        ))
      )}
    </Grid>
  );

  return (
    <Stack sx={{ p }}>
      <EditableTitle
        title={`Licences/Certificates (${licences?.length || "0"})`}
        isMyProfile={isMyProfile}
        setOpenEdit={setOpenEdit}
        sx={{ mb: tmb }}
      />
      {isMobile ? mobileCards() : desktopCards()}
      {selectedLicense && (
        <FullScreenModal
          title={selectedLicense.name}
          open={openImg}
          setOpen={setOpenImg}
        >
          <img
            src={selectedLicense.url}
            alt={selectedLicense.name}
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
      {isMyProfile && contractor && (
        <CustomModal title="Licenses" open={openEdit} onClose={setOpenEdit}>
          <UserLicenseEdit
            contractor={contractor}
            onClose={() => setOpenEdit(false)}
          />
        </CustomModal>
      )}
    </Stack>
  );
}

const LicensesSkeleton = () => (
  <>
    <Grid item>
      <Skeleton
        variant="rounded"
        sx={{ width: 200, height: 150, borderRadius: 2 }}
      />
      <Skeleton variant="text" width={100} />
    </Grid>
    <Grid item>
      <Skeleton
        variant="rounded"
        sx={{ width: 200, height: 150, borderRadius: 2 }}
      />
      <Skeleton variant="text" width={100} />
    </Grid>
  </>
);

const MobileLicenseSkeleton = () => (
  <>
    <Skeleton
      variant="rounded"
      sx={{ width: "100%", height: 200, borderRadius: 2 }}
    />
    <Skeleton variant="text" width={"90%"} />
  </>
);
