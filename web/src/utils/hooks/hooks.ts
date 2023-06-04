import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";

import { RootState, AppDispatch } from "../../redux/store";

//redux hooks follows
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//other hooks follows
export const useIsSmallScreen = () => useMediaQuery("(max-width: 600px)");

//useResponsiveValue, return given values for small screen or otherwise
export const useRespVal = (smallVal: any, otherVal: any) => {
  return useIsSmallScreen() ? smallVal : otherVal;
};
