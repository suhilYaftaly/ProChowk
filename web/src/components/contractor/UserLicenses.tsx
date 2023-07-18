import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import CustomModal from "@reusable/CustomModal";
import FullScreenModal from "@reusable/FullScreenModal";
import { IUserInfo } from "@user/userProfile/UserInfo";
import UserLicensesEdit from "./edits/UserLicensesEdit";

export default function UserLicenses({
  user,
  isMyProfile,
  contrData,
  contProfLoading,
}: IUserInfo) {
  const [openFullImg, setOpenFullImg] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [activeLicense, setActiveLicense] = useState(contrData?.licenses?.[0]);

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Licenses
        </Typography>

        {isMyProfile && (
          <IconButton onClick={() => setOpenEdit(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Stack>
      <Grid
        container
        direction={"row"}
        spacing={1}
        sx={{ overflowX: "auto", flexWrap: "nowrap", pb: 2, mb: -2 }}
      >
        {contrData?.licenses
          ? contrData?.licenses?.map((l) => (
              <Grid item key={l.desc}>
                <Card sx={{ width: 120, height: "100%" }}>
                  <CardActionArea
                    onClick={() => {
                      setActiveLicense(l);
                      setOpenFullImg(!openFullImg);
                    }}
                  >
                    <img
                      src={l.picture}
                      alt={l.name}
                      loading="lazy"
                      style={{ width: 120, height: 120 }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="ellipsis1Line"
                      >
                        {l.desc}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          : contProfLoading && (
              <>
                <Grid item>
                  <Skeleton variant="rounded" width={120} height={120} />
                </Grid>
                <Grid item>
                  <Skeleton variant="rounded" width={120} height={120} />
                </Grid>
                <Grid item>
                  <Skeleton variant="rounded" width={120} height={120} />
                </Grid>
              </>
            )}
      </Grid>
      {activeLicense && (
        <FullScreenModal
          title={activeLicense?.desc}
          open={openFullImg}
          setOpen={setOpenFullImg}
        >
          <img
            src={activeLicense.picture}
            alt={activeLicense.name}
            loading="lazy"
            style={{ width: "100%", objectFit: "cover" }}
          />
        </FullScreenModal>
      )}

      <CustomModal title="Edit Licenses" open={openEdit} onClose={setOpenEdit}>
        <UserLicensesEdit
          user={user}
          contrData={contrData}
          closeEdit={() => setOpenEdit(false)}
        />
      </CustomModal>
    </>
  );
}
