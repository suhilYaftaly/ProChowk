import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Theme, useMediaQuery } from "@mui/material";

import { RootState, AppDispatch } from "../../redux/store";

//redux hooks follows
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//other hooks follows
export const useIsMobile = () =>
  useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
/**return mobile/desktop value based on screen size*/
export const useRespVal = (mobile: any, desktop: any) =>
  useIsMobile() ? mobile : desktop;
