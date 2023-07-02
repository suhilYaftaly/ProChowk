import {
  Typography,
  Grid,
  Stack,
  IconButton,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import CustomModal from "@reusable/CustomModal";
import { IUserInfo } from "@user/userProfile/UserInfo";
import AddAd from "./edits/AddAd";
import { IAd } from "./edits/AdForm";
import EditAd from "./edits/EditAd";

export default function Ads({
  isMyProfile,
  contProfLoading,
  contrData,
}: IUserInfo) {
  const [ads, setAds] = useState<IAd[] | undefined>();
  const [editAd, setEditAd] = useState<IAd | undefined>();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const onEditClick = (ad: IAd) => {
    setEditAd(ad);
    setOpenEdit(true);
  };

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h5">ADs</Typography>
        {isMyProfile && (
          <IconButton onClick={() => setOpenAdd(true)}>
            <AddIcon />
          </IconButton>
        )}
      </Stack>
      <Grid container spacing={1} direction={"column"} sx={{ mt: 1 }}>
        {ads
          ? ads?.map((ad) => (
              <Grid item key={ad.id}>
                <Card raised>
                  <CardContent>
                    <Stack
                      direction={"row"}
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography gutterBottom variant="h5">
                        {ad.title}
                      </Typography>
                      {isMyProfile && (
                        <IconButton onClick={() => onEditClick(ad)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {ad.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : contProfLoading && (
              <>
                <Grid item>
                  <Skeleton variant="rounded" width={"100%"} height={100} />
                </Grid>
                <Grid item>
                  <Skeleton variant="rounded" width={"100%"} height={100} />
                </Grid>
                <Grid item>
                  <Skeleton variant="rounded" width={"100%"} height={100} />
                </Grid>
              </>
            )}
      </Grid>
      <CustomModal title="Add New AD" open={openAdd} onClose={setOpenAdd}>
        <AddAd
          setAds={setAds}
          closeEdit={() => setOpenAdd(false)}
          contrData={contrData}
        />
      </CustomModal>
      {editAd && (
        <CustomModal title="Edit AD" open={openEdit} onClose={setOpenEdit}>
          <EditAd
            ad={editAd}
            setAd={setEditAd}
            setAds={setAds}
            closeEdit={() => setOpenEdit(false)}
          />
        </CustomModal>
      )}
    </>
  );
}
