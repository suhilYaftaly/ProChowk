import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import { toast } from "react-toastify";

import { useAppDispatch } from "@utils/hooks/hooks";
import {
  logIn,
  userLocationError,
  userLocationSuccess,
} from "@rSlices/userSlice";
import { getUserLocation } from "@utils/utilFuncs";
import { useReverseGeocode } from "@gqlOps/address";
import { useUpdateUser } from "@gqlOps/user";
import { useUserStates } from "@redux/reduxStates";
import { getAddressFormat } from "@appComps/AddressSearch";
import Text from "@reusable/Text";
import { userLocationLearnMoreLink } from "@constants/links";

export default function UserLocationPermission() {
  const dispatch = useAppDispatch();
  const { userLocation, user } = useUserStates();
  const { lat, lng } = userLocation?.data || {};
  const { reverseGeocodeAsync } = useReverseGeocode();
  const { updateUserAsync } = useUpdateUser();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const getLocation = () =>
    getUserLocation({
      onSuccess: ({ lat, lng }) => {
        setShowLocationModal(false);
        dispatch(userLocationSuccess({ lat, lng }));
      },
      onError: (error) => {
        dispatch(userLocationError({ error }));
        setShowLocationModal(true);
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "denied") {
              setIsPermissionDenied(true);
              toast.warning(
                "We noticed you've denied location access, Please enable location services from the browser settings",
                { autoClose: 15000 }
              );
            }
          });
      },
    });

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

  useEffect(() => {
    // Initial permission check
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "prompt") setShowLocationModal(true);
        else if (permissionStatus.state === "granted") getLocation();
        else {
          setShowLocationModal(true);
          setIsPermissionDenied(true);
        }
      });
  }, []);

  //if coordinates are available and user doesnt have address then assigne address to user
  useEffect(() => {
    if (lat && lng && !user?.address?.city && user?.id && user.emailVerified)
      assignUserAddress();
  }, [lat, lng, user]);

  const onLearnMore = () =>
    window.open(userLocationLearnMoreLink, "_blank", "noreferrer");

  return (
    <Dialog
      open={showLocationModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ textAlign: "center" }}>
        {"Location Permission Required"}
      </DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        <ShareLocationIcon
          color="primary"
          sx={{ width: 100, height: 100, mb: 1 }}
        />
        {isPermissionDenied ? (
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center" }}
          >
            <Text type="subtitle" cColor="info">
              We noticed you've denied location access.
            </Text>
            <br />
            <br />
            While you can still use our app, enabling location helps us:
            <br />
            - Customize content and services for you
            <br />
            - Provide location-specific recommendations
            <br />
            - Enhance user experience
            <br />
            <br />
            To enable location services later, you can do so from the browser
            settings. <Button onClick={onLearnMore}>Learn More</Button>
            <br />
            <br />
            Your privacy matters to us. Your location data is secure and will
            never be shared without your consent.
          </DialogContentText>
        ) : (
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center" }}
          >
            To enhance your experience and provide personalized services, we'd
            like to access your location data.
            <br />
            <br />
            Why we collect your location:
            <br />
            - Tailor content, services, and offers specific to your region.
            <br />
            - Provide location-based assistance or recommendations. <br />-
            Improve our website's functionality and your user experience. <br />
            <br />
            Your privacy matters:
            <br />
            Your location data is collected and stored securely. We do not share
            this information with third parties without your consent, and you
            can withdraw your permission at any time in the settings.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          onClick={() => setShowLocationModal(false)}
          variant="outlined"
          color="inherit"
        >
          Not Now
        </Button>
        <Button onClick={getLocation} color="primary" variant="contained">
          Enable Location
        </Button>
      </DialogActions>
    </Dialog>
  );
}
