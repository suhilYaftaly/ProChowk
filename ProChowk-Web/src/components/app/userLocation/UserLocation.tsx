import { useEffect } from "react";
import { useAppDispatch } from "../../../utils/hooks";
import {
  userLocationError,
  userLocationSuccess,
} from "../../../redux/slices/userSlice";
import { useUserStates } from "../../../redux/reduxStates";

export default function UserLocation() {
  const dispatch = useAppDispatch();
  const { userLocation } = useUserStates();
  const lat = userLocation?.data?.lat;
  const lng = userLocation?.data?.lng;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(userLocationSuccess({ lat: latitude, lng: longitude }));
        },
        (error) => {
          dispatch(
            userLocationError({
              ...error,
              message: "Location permission denied",
            })
          );
        }
      );
    } else {
      dispatch(
        userLocationError({
          message: "Geolocation is not supported by this browser.",
        })
      );
    }
  }, []);

  useEffect(() => {
    if (lat && lng && !userLocation?.data?.address) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          dispatch(userLocationSuccess({ ...userLocation.data, ...data }));
        })
        .catch((error) => {
          dispatch(userLocationError(error));
        });
    }
  }, [lat, lng]);

  return <div></div>;
}
