import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";

import { RootState, AppDispatch } from "../redux/store";

//redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//other hooks
export const useIsSmallScreen = () => useMediaQuery("(max-width: 600px)");
//return given values for small screen or otherwise. SV=SmallValue, OV=OtherValue
export const useGetSSV = (SV: any, OV: any) => {
  const isSmallScreen = useIsSmallScreen();
  return isSmallScreen ? SV : OV;
};
