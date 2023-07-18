import {
  Typography,
  Grid,
  Stack,
  IconButton,
  Skeleton,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomModal from "@reusable/CustomModal";
import { IUserInfo } from "@user/userProfile/UserInfo";
import AddAd from "./edits/AddAd";
import EditAd from "./edits/EditAd";
import { SkillInput } from "@gqlOps/contractor";

export interface IAdSkill extends SkillInput {
  selected: boolean;
}

export interface IAd {
  id: string;
  title: string;
  desc: string;
  type: "Service" | "Job";
  skills: IAdSkill[];
}

export default function Ads({
  isMyProfile,
  contProfLoading,
  contrData,
}: IUserInfo) {
  const [ads, setAds] = useState<IAd[] | undefined>([
    {
      id: "sdfsdf",
      title: "Sample Service Ad",
      desc: "Experience excellence in tiling, interlocking, and landscaping with Checkmate Tiling. With 200+ successful projects, our expert team delivers stunning results. From transforming floors to creating captivating outdoor spaces, trust us to bring your vision to life with precision and expertise.",
      type: "Service",
      skills: [
        { label: "Tiling", selected: true },
        { label: "Renovation", selected: true },
      ],
    },
  ]);
  const [editAd, setEditAd] = useState<IAd>({
    id: String(Math.random()),
    type: "Service",
    title: "",
    desc: "",
    skills: [],
  });
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const onEditClick = (ad: IAd) => {
    setEditAd(ad);
    setOpenEdit(true);
  };
  const onDeleteClick = (ad: IAd) => {
    setAds((pv) => pv && pv.filter((item) => item.id !== ad.id));
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
                <Card>
                  <CardContent>
                    <Stack
                      direction={"row"}
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>{ad.title}</Typography>
                      <Stack direction="row" sx={{ alignItems: "center" }}>
                        <Chip
                          label={ad.type}
                          variant="outlined"
                          sx={{ mr: 1 }}
                          size="small"
                        />
                        {isMyProfile && (
                          <>
                            <IconButton
                              onClick={() => onEditClick(ad)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => onDeleteClick(ad)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {ad.desc}
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 2 }}>
                      {ad.skills?.map(
                        (skill) =>
                          skill.selected && (
                            <Grid item key={skill.label}>
                              <Chip
                                label={skill.label}
                                variant="filled"
                                size="small"
                              />
                            </Grid>
                          )
                      )}
                    </Grid>
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
      <CustomModal title="Edit AD" open={openEdit} onClose={setOpenEdit}>
        <EditAd
          ad={editAd}
          setAd={setEditAd}
          setAds={setAds}
          closeEdit={() => setOpenEdit(false)}
        />
      </CustomModal>
    </>
  );
}
