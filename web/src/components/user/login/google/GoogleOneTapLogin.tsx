import { useGoogleOneTapLogin } from "@react-oauth/google";

import { useAppDispatch } from "../../../../utils/hooks/hooks";
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
            ...DT,
            id: DT.sub,
            firstName: DT.name,
            emailVerified: DT.email_verified,
            dateJoined: String(Date.now()),
            image: { picture: DT.picture },
          })
        );
      } else dispatch(userProfileError(DT));
    },
    onError: () => dispatch(googleTokenError({ error: "unknown error" })),
  });

  return null;
}
