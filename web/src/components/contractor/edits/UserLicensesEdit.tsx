import { Alert } from "@mui/material";

import FileUpload from "@reusable/FileUpload";
import { IUserInfo } from "@/components/user/userProfile/UserInfoOld";
import { LicenseInput, useAddContractorLicense } from "@gqlOps/contractor";

interface Props extends IUserInfo {
  closeEdit: () => void;
}

export default function UserLicensesEdit({ contrData, closeEdit }: Props) {
  const { addContLicAsync, error, loading } = useAddContractorLicense();

  const onLicenseUpload = (fileData: LicenseInput) => {
    if (contrData?.id) {
      addContLicAsync({
        variables: { license: fileData, contId: contrData.id },
        onSuccess: closeEdit,
      });
    }
  };

  return (
    <>
      <FileUpload onFileUpload={onLicenseUpload} loading={loading} />
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
    </>
  );
}
