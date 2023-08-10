import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";

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
import { setGlobalError } from "@rSlices/settingsSlice";

export default function UserLocationPermission() {
  const dispatch = useAppDispatch();
  const { userLocation, user } = useUserStates();
  const { lat, lng } = useUserStates()?.userLocation?.data || {};
  const { reverseGeocodeAsync } = useReverseGeocode();
  const { updateUserAsync } = useUpdateUser();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const locPermTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); //locationPermissionTimeout
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasHandledLocation = useRef(false);

  useEffect(() => {
    getLocation();
    // If the user doesn't answer the location request within 10 seconds, show the modal.
    locPermTimeout.current = setTimeout(() => {
      if (!hasHandledLocation.current) setShowLocationModal(true);
    }, 10000);
  }, []);

  //check if permission has been granted from settings
  useEffect(() => {
    const checkPermission = async () => {
      if (navigator && navigator.permissions) {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        if (status.state === "granted" && !lat && !lng) getLocation();
        if (status.state === "denied" && !lat && !lng)
          setShowLocationModal(true);
      }
    };

    // Periodically check for location permission status.
    intervalIdRef.current = setInterval(checkPermission, 15000);
    return () => clearInterval(intervalIdRef.current!);
  }, [lat, lng]);

  const assignUserAddress = async () => {
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

  //if coordinates are available and user doesnt have address then assigne address to user
  useEffect(() => {
    if (lat && lng && !user?.address?.city && user?.id) assignUserAddress();
  }, [lat, lng, user]);

  const handleCloseDialog = (_: any, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return; // Don't close the dialog for these reasons
    closeLocationDialog();
  };

  const getLocation = () => {
    getUserLocation({
      onSuccess: ({ lat, lng }) => {
        clearTimeout(locPermTimeout.current!);
        dispatch(userLocationSuccess({ lat, lng }));
        closeDialog();
        hasHandledLocation.current = true;
      },
      onError: (message) => {
        userLocationError({ message });
        setShowLocationModal(true);
        hasHandledLocation.current = true;
        dispatch(
          setGlobalError(
            "Location permission denied or access not provided yet."
          )
        );
      },
    });
  };

  const closeLocationDialog = () => {
    if (userLocation?.data) closeDialog();
    else getLocation();
  };

  const closeDialog = () => {
    setShowLocationModal(false);

    if (locPermTimeout.current) clearTimeout(locPermTimeout.current);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const enableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      dispatch(setGlobalError("Geolocation is not supported by this browser."));
    }
  };

  const handleSuccess = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    dispatch(userLocationSuccess({ lat, lng }));
  };

  const handleError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        dispatch(
          setGlobalError(
            "User denied the request for Geolocation. Please grant access through settings"
          )
        );
        break;
      case error.POSITION_UNAVAILABLE:
        dispatch(setGlobalError("Location information is unavailable"));
        break;
      case error.TIMEOUT:
        dispatch(
          setGlobalError(
            "The request to get user location timed out. Please grant access through settings"
          )
        );
        break;
      default:
        dispatch(
          setGlobalError(
            "An unknown error occurred. Please grant access through settings"
          )
        );
        break;
    }
  };

  return (
    <Dialog
      open={showLocationModal}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableEscapeKeyDown
    >
      <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
        {"Location Permission Required"}
      </DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        <ShareLocationIcon
          color="primary"
          sx={{ width: 100, height: 100, mb: 1 }}
        />
        <DialogContentText
          id="alert-dialog-description"
          style={{ textAlign: "center" }}
        >
          To provide you with the best experience, we need access to your
          location. This is essential for many of our application's features. If
          you've already granted access from your settings, please click on the
          "I've granted access" button below.
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={enableLocation} color="primary" variant="contained">
          Enable Location
        </Button>

        <Button onClick={closeLocationDialog} color="primary">
          I've granted access
        </Button>
      </DialogActions>
    </Dialog>
  );
}
