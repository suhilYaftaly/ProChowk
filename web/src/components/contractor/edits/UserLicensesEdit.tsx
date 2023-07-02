import {
  Divider,
  Grid,
  Badge,
  Typography,
  Card,
  Stack,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";

import FileUpload from "@reusable/FileUpload";
import { IUserInfo } from "@user/userProfile/UserInfo";
import { LicensesInput, useUpdateContrProf } from "@gqlOps/contractor";

interface Props extends IUserInfo {
  closeEdit: () => void;
}

export default function UserLicensesEdit({
  user,
  contrData,
  closeEdit,
}: Props) {
  const { updateContrProfAsync, error, loading } = useUpdateContrProf();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [allLicenses, setAllLicenses] = useState<LicensesInput[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (contrData?.licenses) {
      const updatedLicenses = contrData?.licenses.map((license) => {
        const { __typename, ...licenseWithoutTypename } = license as any;
        return licenseWithoutTypename;
      });
      setAllLicenses(updatedLicenses);
    }
  }, [contrData?.licenses]);

  const onLicenseUpload = (fileData: LicensesInput) => {
    setAllLicenses((pv) => (pv ? [...pv, { ...fileData }] : [fileData]));
    setDisableSaveBtn(false);
  };
  const onDeleteLicence = (desc: string) => {
    setAllLicenses((pv) => pv && pv.filter((file) => file.desc !== desc));
    setDisableSaveBtn(false);
  };

  const onSaveChanges = () => {
    if (user) {
      updateContrProfAsync({
        variables: { licenses: allLicenses },
        userId: user.id,
        onSuccess: closeEdit,
      });
      setDisableSaveBtn(true);
    }
  };

  return (
    <>
      <FileUpload onFileUpload={onLicenseUpload} />
      {allLicenses && allLicenses?.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={1}>
            {allLicenses?.map((file) => (
              <Grid item key={file.desc}>
                <Stack direction={"column"}>
                  <Badge
                    badgeContent={
                      <Card
                        sx={{
                          boxShadow: 4,
                          borderRadius: 50,
                          px: 0.5,
                          cursor: "pointer",
                        }}
                        onClick={() => onDeleteLicence(file.desc)}
                      >
                        <Typography>✖</Typography>
                      </Card>
                    }
                    overlap="circular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <img
                      src={file.picture}
                      alt={file.desc}
                      width="75"
                      height="75"
                      style={{ borderRadius: 50 }}
                    />
                  </Badge>
                  <Typography
                    variant="caption"
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  >
                    {file.desc.length > 6
                      ? `${file.desc.slice(0, 6)}...`
                      : file.desc}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            disabled={disableSaveBtn}
            onClick={onSaveChanges}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
          {error && (
            <Alert severity="error" color="error">
              {error.message}
            </Alert>
          )}
        </>
      )}
    </>
  );
}
