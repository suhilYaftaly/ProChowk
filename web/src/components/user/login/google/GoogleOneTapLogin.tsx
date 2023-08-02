import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, userProfileBegin, userProfileError } from "@rSlices/userSlice";
import { useGOneTapLogin } from "@gqlOps/user";
import { openUserIfNewUser } from "@/utils/utilFuncs";

export default function GoogleOneTapLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { gOneTapLoginAsync } = useGOneTapLogin();

  useGoogleOneTapLogin({
    onSuccess: async (token) => {
      if (token?.credential) {
        dispatch(userProfileBegin());
        gOneTapLoginAsync({
          variables: { credential: token.credential },
          onSuccess: (d) => {
            dispatch(logIn(d));
            openUserIfNewUser({ user: d, navigate });
          },
          onError: (err) =>
            dispatch(userProfileError({ message: err?.message })),
        });
      }
    },
    onError: () =>
      dispatch(userProfileError({ message: "Google One Tap sign in error" })),
  });

  return null;
}
