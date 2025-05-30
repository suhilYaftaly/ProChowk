import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";

import { useAppDispatch } from "@utils/hooks/hooks";
import { userLocationError, userLocationSuccess } from "@rSlices/userSlice";
import { getUserLocation } from "@utils/utilFuncs";
import Text from "@reusable/Text";
import { userLocationLearnMoreLink } from "@constants/links";

export default function UserLocationPermission() {
  const dispatch = useAppDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const getLocation = () =>
    getUserLocation({
      onSuccess: ({ lat, lng }) => {
        setShowLocationModal(false);
        dispatch(userLocationSuccess({ lat, lng }));
      },
      onError: (error) => {
        dispatch(userLocationError({ error: error?.message }));
        setShowLocationModal(true);
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "denied") {
              setIsPermissionDenied(true);
            }
          });
      },
    });

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

  return (
    <Dialog open={showLocationModal}>
      <DialogContent style={{ textAlign: "center" }}>
        <ShareLocationIcon sx={{ width: 100, height: 100, mb: 1 }} />
        {isPermissionDenied ? (
          isDenielText
        ) : (
          <>
            <Text type="title" sx={{ mb: 1 }}>
              Location Permission Required
            </Text>
            <Text>
              To enhance your experience and provide personalized services, we'd
              like to access your location data.
            </Text>
            {!showMore ? (
              <Button onClick={() => setShowMore(true)}>Read More</Button>
            ) : (
              <>
                <Text type="subtitle" sx={{ mb: 1, mt: 3 }}>
                  Why we collect your location
                </Text>
                <Text>
                  - Tailor content, services, and offers specific to your
                  region.
                  <br />- Provide location-based assistance or recommendations.
                  <br />- Improve our website's functionality and your user
                  experience.
                </Text>
                <Text sx={{ my: 1, mt: 3 }} type="subtitle">
                  Your privacy matters
                </Text>
                <Text>
                  Your location data is collected and stored securely. We do not
                  share this information with third parties without your
                  consent, and you can withdraw your permission at any time in
                  the settings.
                </Text>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", mx: 2, mb: 1 }}>
        <Button
          onClick={getLocation}
          color="primary"
          variant="contained"
          sx={{ borderRadius: 5, mb: 2 }}
          fullWidth
        >
          Enable Location
        </Button>
        <Button
          onClick={() => setShowLocationModal(false)}
          sx={{ color: "grey" }}
        >
          Skip for now
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function EnableUserLocation() {
  const dispatch = useAppDispatch();
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const getLocation = () =>
    getUserLocation({
      onSuccess: ({ lat, lng }) => dispatch(userLocationSuccess({ lat, lng })),
      onError: (error) => {
        dispatch(userLocationError({ error: error?.message }));
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "denied") {
              setIsPermissionDenied(true);
            }
          });
      },
    });

  return (
    <Stack sx={{ alignItems: "center" }}>
      <Stack
        sx={{ alignItems: "center", my: 2, maxWidth: 400, textAlign: "center" }}
      >
        {isPermissionDenied ? (
          isDenielText
        ) : (
          <>
            <Text type="subtitle">
              Enable your location to see tailored results!
            </Text>
            <Text sx={{ mt: 2 }}>
              To enable location services later, you can do so from the browser
              settings. <Button onClick={onLearnMore}>Learn More</Button>
            </Text>
          </>
        )}
        <Button
          onClick={getLocation}
          color="primary"
          variant="contained"
          sx={{ borderRadius: 5, mt: 3 }}
          fullWidth
        >
          Enable Location
        </Button>
      </Stack>
    </Stack>
  );
}

const onLearnMore = () =>
  window.open(userLocationLearnMoreLink, "_blank", "noreferrer");

const isDenielText = (
  <>
    <Text type="title" cColor="info" sx={{ mb: 1 }}>
      We noticed you've denied location access.
    </Text>
    <Text type="subtitle" sx={{ mb: 1 }}>
      While you can still use our app, enabling location helps us:
    </Text>
    <Text>
      - Customize content and services for you
      <br />- Provide location-specific recommendations
      <br />- Enhance user experience
    </Text>
    <Text type="subtitle" cColor="info" sx={{ my: 2 }}>
      To enable location services later, you can do so from the browser
      settings. <Button onClick={onLearnMore}>Learn More</Button>
    </Text>
    <Text>
      Your privacy matters to us. Your location data is secure and will never be
      shared without your consent.
    </Text>
  </>
);
