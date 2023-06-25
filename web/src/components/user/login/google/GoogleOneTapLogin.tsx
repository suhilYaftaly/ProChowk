import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useMutation } from "@apollo/client";

import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, userProfileBegin, userProfileError } from "@rSlices/userSlice";
import userOps, {
  IGoogleOneTapLoginData,
  IGoogleOneTapLoginInput,
} from "@gqlOps/user";
import { openUserIfNewUser } from "@/utils/utilFuncs";
import { useNavigate } from "react-router-dom";

export default function GoogleOneTapLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [googleOneTapLogin] = useMutation<
    IGoogleOneTapLoginData,
    IGoogleOneTapLoginInput
  >(userOps.Mutations.googleOneTapLogin);

  useGoogleOneTapLogin({
    onSuccess: async (token) => {
      try {
        dispatch(userProfileBegin());
        if (token.credential) {
          const { data } = await googleOneTapLogin({
            variables: { credential: token.credential },
          });
          const userData = data?.googleOneTapLogin;
          if (userData) {
            dispatch(logIn(userData));
            openUserIfNewUser({ user: userData, navigate });
          } else throw new Error();
        } else throw new Error();
      } catch (error: any) {
        dispatch(userProfileError({ message: error?.message }));
      }
    },
    onError: () =>
      dispatch(userProfileError({ message: "Google One Tap sign in error" })),
  });

  return null;
}
