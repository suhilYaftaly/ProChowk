import { useGoogleOneTapLogin } from "@react-oauth/google";

import { useAppDispatch } from "../../../utils/hooks";
import {
  googleTokenError,
  googleTokenSuccess,
  setUserProfile,
  userProfileError,
} from "../../../redux/slices/userSlice";
import { decodeJwtToken } from "../../../utils/utilFuncs";

export default function GoogleOneTapLogin() {
  const dispatch = useAppDispatch();

  useGoogleOneTapLogin({
    onSuccess: (token) => {
      dispatch(googleTokenSuccess(token));
      const decodedToken = decodeJwtToken(token.credential);
      if (decodedToken) {
        dispatch(setUserProfile({ ...decodedToken, id: decodedToken.sub }));
      } else dispatch(userProfileError(decodedToken));
    },
    onError: () => dispatch(googleTokenError({ error: "unknown error" })),
  });

  return null;
}
