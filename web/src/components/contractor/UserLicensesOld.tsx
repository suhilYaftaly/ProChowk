import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  IconButton,
  Stack,
  Skeleton,
  Badge,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import CustomModal from "@reusable/CustomModal";
import FullScreenModal from "@reusable/FullScreenModal";
import { IUserInfo } from "@/components/user/userProfile/UserInfoOld";
import UserLicensesEdit from "./edits/UserLicensesEdit";
import { useRespVal } from "@/utils/hooks/hooks";
import { useDeleteContractorLicense } from "@gqlOps/contractor";

export default function UserLicenses({
  isMyProfile,
  contrData,
  contProfLoading,
}: IUserInfo) {
  const [openFullImg, setOpenFullImg] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [activeLicense, setActiveLicense] = useState(contrData?.licenses?.[0]);
  const fsWidth = useRespVal("100%", undefined);
  const { deleteContLicAsync } = useDeleteContractorLicense();

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
            <AddIcon />
          </IconButton>
        )}
      </Stack>
      <Grid
        container
        direction={"row"}
        spacing={1}
        sx={{ overflowX: "auto", flexWrap: "nowrap", py: 1, my: -1 }}
      >
        {contrData?.licenses
          ? contrData?.licenses?.map((l) => (
              <Grid item key={l.id}>
                {isMyProfile ? (
                  <Badge
                    badgeContent={
                      <Card
                        sx={{
                          boxShadow: 4,
                          borderRadius: 50,
                          px: 0.5,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          deleteContLicAsync({
                            variables: { contId: contrData.id, licId: l.id },
                          })
                        }
                      >
                        <Typography>✖</Typography>
                      </Card>
                    }
                  >
                    <Card sx={{ width: 120, height: "100%" }}>
                      <CardActionArea
                        onClick={() => {
                          setActiveLicense(l);
                          setOpenFullImg(!openFullImg);
                        }}
                      >
                        <img
                          src={l.url}
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
                  </Badge>
                ) : (
                  <Card sx={{ width: 120, height: "100%" }}>
                    <CardActionArea
                      onClick={() => {
                        setActiveLicense(l);
                        setOpenFullImg(!openFullImg);
                      }}
                    >
                      <img
                        src={l.url}
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
                )}
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
            src={activeLicense.url}
            alt={activeLicense.name}
            loading="lazy"
            style={{ width: fsWidth, objectFit: "cover" }}
          />
        </FullScreenModal>
      )}

      <CustomModal title="Edit Licenses" open={openEdit} onClose={setOpenEdit}>
        <UserLicensesEdit
          contrData={contrData}
          closeEdit={() => setOpenEdit(false)}
        />
      </CustomModal>
    </>
  );
}
