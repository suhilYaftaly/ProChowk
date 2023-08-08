import { useEffect } from "react";

import { useUserStates } from "@redux/reduxStates";
import { useAppDispatch } from "@utils/hooks/hooks";
import {
  logIn,
  userLocationError,
  userLocationSuccess,
} from "@rSlices/userSlice";
import { useReverseGeocode } from "@gqlOps/address";
import { getUserLocation } from "@utils/utilFuncs";
import { useUpdateUser } from "@gqlOps/user";
import { getAddressFormat } from "@appComps/AddressSearch";

export default function useUserLocation() {
  const dispatch = useAppDispatch();
  const { userLocation, user } = useUserStates();
  const lat = userLocation?.data?.lat;
  const lng = userLocation?.data?.lng;
  const { reverseGeocodeAsync } = useReverseGeocode();
  const { updateUserAsync } = useUpdateUser();

  useEffect(() => {
    getUserLocation({
      onSuccess: ({ lat, lng }) => dispatch(userLocationSuccess({ lat, lng })),
      onError: (message) => userLocationError({ message }),
    });
  }, []);

  const getAddress = async () => {
    if (lat && lng && !user?.address?.city && user?.id) {
      reverseGeocodeAsync({
        variables: { lat, lng },
        onSuccess: (addr) => {
          dispatch(logIn({ ...user, address: addr }));
          updateUserAsync({
            variables: {
              id: user.id,
              edits: { address: getAddressFormat(addr) },
            },
          });
        },
      });
    }
  };

  useEffect(() => {
    if (lat && lng && !user?.address?.city && user?.id) getAddress();
  }, [lat, lng, user]);
}
