import { Button, SxProps, Theme, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import { useUserStates } from "@/redux/reduxStates";
import { paths } from "@/routes/Routes";
import {
  isClient,
  isContractor,
  isUserClientAndContractor,
} from "@/utils/auth";
import { USER_VIEW } from "@/constants/localStorageKeys";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { setUserView } from "@/redux/slices/userSlice";

interface Props {
  sx?: SxProps<Theme>;
  variant?: "text" | "contained" | "outlined";
  onClick?: () => void;
}
export default function SwitchUserViewButton({
  sx,
  variant = "contained",
  onClick,
}: Props) {
  const theme = useTheme();
  const palette = theme.palette;
  const dispatch = useAppDispatch();
  const whiteC = palette.common.white;
  const darkTC =
    palette.mode === "light" ? palette.text.dark : palette.secondary.dark;
  const navigate = useNavigate();
  const savedView = localStorage.getItem(USER_VIEW) as TUserView | null;
  const { user, userView } = useUserStates();
  const userTypes = user?.userTypes;

  //userType conditions
  const isVerifyEmail = isClient(userTypes) && !user?.emailVerified;
  const isBecomeContractor = isClient(userTypes) && !isContractor(userTypes);
  const isSwitchToCont =
    isUserClientAndContractor(userTypes) && userView === "Client";
  const isSwitchToClient =
    isUserClientAndContractor(userTypes) && userView === "Contractor";

  useEffect(() => {
    if (user && (isVerifyEmail || isBecomeContractor || !savedView)) {
      switchView("Client");
    } else if (user && savedView) switchView(savedView);
  }, [user]);

  const switchView = (newView: TUserView) => {
    localStorage.setItem(USER_VIEW, newView);
    dispatch(setUserView(newView));
    onClick && onClick();
  };

  const onVerifyEmail = () => {
    navigate(paths.verifyEmail);
    onClick && onClick();
  };
  const onBecomeContractor = () => {
    navigate(paths.profileSetup("contractor"));
    onClick && onClick();
  };

  const getBtnProps = () => {
    if (isVerifyEmail) {
      return {
        text: "Verify Email",
        action: onVerifyEmail,
      };
    } else if (isBecomeContractor) {
      return {
        text: "Become Contractor",
        action: onBecomeContractor,
      };
    } else if (isSwitchToCont) {
      return {
        text: "Switch to Contractor",
        action: () => switchView("Contractor"),
      };
    } else if (isSwitchToClient) {
      return {
        text: "Switch to Client",
        action: () => switchView("Client"),
      };
    }
  };

  const btnProps = getBtnProps();

  if (!isClient(userTypes)) return null;

  return (
    <Button
      variant={variant}
      onClick={btnProps?.action}
      color="inherit"
      sx={{
        backgroundColor: whiteC,
        fontWeight: 550,
        color: darkTC,
        ...sx,
      }}
      endIcon={
        <ArrowCircleRightIcon color="primary" sx={{ width: 25, height: 25 }} />
      }
    >
      {btnProps?.text}
    </Button>
  );
}

export type TUserView = "Client" | "Contractor";
