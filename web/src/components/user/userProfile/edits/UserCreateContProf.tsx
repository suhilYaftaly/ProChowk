import {
  Card,
  Button,
  CircularProgress,
  Alert,
  Typography,
  useTheme,
} from "@mui/material";
import { IUserInfo } from "../UserInfo";
import { useCreateContractor } from "@gqlOps/contractor";

interface Props extends IUserInfo {
  setHideContNFErr?: (hide: boolean) => void;
}

export default function UserCreateContProf({
  user,
  userId,
  setHideContNFErr,
}: Props) {
  const theme = useTheme();
  const { createContractorAsync, loading, error } = useCreateContractor();

  const onCreateContProf = () => {
    if (userId && user?.userTypes) {
      setHideContNFErr && setHideContNFErr(true);
      createContractorAsync({ variables: { userId } });
    }
  };

  return (
    <Card sx={{ boxShadow: 4, p: 2 }}>
      <Typography color={theme.palette.info.main} variant="h5">
        Sign up for a free contractor account!
      </Typography>
      <Typography sx={{ my: 2 }}>
        Are you a skilled contractor in the construction industry looking to
        expand your opportunities and grow your business? Look no further! Our
        platform offers you the perfect solution to showcase your expertise and
        connect with a wide range of potential clients. By signing up for a
        contractor account, you'll gain access to a thriving community of users
        actively seeking reliable professionals like you to undertake their
        construction projects. Whether you specialize in residential,
        commercial, or industrial construction, our platform provides a seamless
        and efficient way to accept contracts and build lasting relationships
        with satisfied customers. Take your contracting business to new heights
        by joining our platform today and unlocking a world of exciting
        opportunities. Sign up now and watch your business thrive!
      </Typography>
      <Button
        type="submit"
        variant="contained"
        onClick={onCreateContProf}
        disabled={loading}
        fullWidth
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Create your contractor profile"
        )}
      </Button>
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
    </Card>
  );
}
