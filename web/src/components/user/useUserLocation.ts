import { useEffect } from "react";
import { useMutation } from "@apollo/client";

import { useUserStates } from "@redux/reduxStates";
import { useAppDispatch } from "@utils/hooks/hooks";
import {
  logIn,
  userLocationError,
  userLocationSuccess,
} from "@rSlices/userSlice";
import userOps, {
  IGetUserAddressData,
  IGetUserAddressInput,
} from "@gqlOps/user";

export default function useUserLocation() {
  const dispatch = useAppDispatch();
  const { userLocation, user } = useUserStates();
  const lat = userLocation?.data?.lat;
  const lng = userLocation?.data?.lng;

  const [getUserAddress] = useMutation<
    IGetUserAddressData,
    IGetUserAddressInput
  >(userOps.Mutations.getUserAddress);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(
            userLocationSuccess({
              lat: String(latitude),
              lng: String(longitude),
            })
          );
        },
        (error) =>
          dispatch(
            userLocationError({
              ...error,
              message: "Location permission denied",
            })
          )
      );
    } else
      dispatch(
        userLocationError({
          message: "Geolocation is not supported by this browser.",
        })
      );
  }, []);

  const getAddress = async () => {
    if (lat && lng && !user?.address && user?.id) {
      try {
        const { data } = await getUserAddress({
          variables: { id: user.id, lat, lng },
        });
        if (data?.getUserAddress) {
          dispatch(logIn(data?.getUserAddress));
        } else throw new Error();
      } catch (error: any) {
        console.log("get user address from lt&lng failed:", error.message);
      }
    }
  };

  useEffect(() => {
    if (lat && lng && !user?.address && user?.id) getAddress();
  }, [lat, lng, user]);
}
