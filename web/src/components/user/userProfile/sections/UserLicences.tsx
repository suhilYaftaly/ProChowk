import { Grid, Skeleton, Stack } from "@mui/material";
import { useState } from "react";

import { ISectionProps } from "../UserProfile";
import Text from "@reusable/Text";
import FullScreenModal from "@reusable/FullScreenModal";
import { useRespVal } from "@hooks/hooks";
import EditableTitle from "../edits/EditableTitle";
import CustomModal from "@reusable/CustomModal";
import UserLicenseEdit from "../edits/UserLicenseEdit";

export default function UserLicences({
  contractor,
  p,
  tmb,
  contrLoading,
  isMyProfile,
}: ISectionProps) {
  const licences = contractor?.licenses;
  const [openImg, setOpenImg] = useState(false);
  const [openImgIndex, setOpenImgIndex] = useState(0);
  const fsWidth = useRespVal("100%", undefined);
  const [openEdit, setOpenEdit] = useState(false);

  const selectedLicense = licences?.[openImgIndex];

  return (
    <Stack sx={{ p }}>
      <EditableTitle
        title={`Licences/Certificates (${licences?.length || "0"})`}
        isMyProfile={isMyProfile}
        setOpenEdit={setOpenEdit}
      />
      <Grid container spacing={1} direction={"row"} sx={{ mt: tmb }}>
        {contrLoading ? (
          <LicenseSkeleton />
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
              <Text>{li.name}</Text>
            </Grid>
          ))
        )}
      </Grid>
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

const LicenseSkeleton = () => {
  return (
    <>
      <Grid item>
        <Skeleton variant="rounded" sx={{ width: 200, height: 150 }} />
        <Skeleton variant="text" width={100} />
      </Grid>
      <Grid item>
        <Skeleton variant="rounded" sx={{ width: 200, height: 150 }} />
        <Skeleton variant="text" width={100} />
      </Grid>
    </>
  );
};
