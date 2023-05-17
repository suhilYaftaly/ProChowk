import { useGoogleOneTapLogin } from "@react-oauth/google";

import { useAppDispatch } from "../../../../utils/hooks";
import {
  googleTokenError,
  googleTokenSuccess,
  logIn,
  userProfileError,
} from "../../../../redux/slices/userSlice";
import { decodeJwtToken } from "../../../../utils/utilFuncs";

export default function GoogleOneTapLogin() {
  const dispatch = useAppDispatch();

  useGoogleOneTapLogin({
    onSuccess: (token) => {
      dispatch(googleTokenSuccess(token));
      const DT = decodeJwtToken(token.credential); //decodedToken
      if (DT) {
        dispatch(
          logIn({
            id: DT.sub,
            firstName: DT.given_name,
            lastName: DT.family_name,
            verifiedEmail: DT.email_verified,
            dateJoined: String(Date.now()),
            ...DT,
          })
        );
      } else dispatch(userProfileError(DT));
    },
    onError: () => dispatch(googleTokenError({ error: "unknown error" })),
  });

  return null;
}
