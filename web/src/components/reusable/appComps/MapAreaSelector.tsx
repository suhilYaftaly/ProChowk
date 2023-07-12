import React, { useState, useEffect, useCallback } from "react";
import { CircleF, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useUserStates } from "@/redux/reduxStates";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Slider,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import { getUserLocation } from "@/utils/utilFuncs";
import { useQuery } from "@apollo/client";
import gMapKeyOps from "@gqlOps/googleMapKey";

export interface IMapAreaDetails {
  radius: number;
  lat: number;
  lng: number;
}

interface Props {
  onMapAreaChange: ({ radius, lat, lng }: IMapAreaDetails) => void;
  radius?: number;
}

const MapAreaSelector = ({ onMapAreaChange, radius }: Props) => {
  const {
    data: gKeyData,
    loading,
    error,
  } = useQuery(gMapKeyOps.Queries.getGoogleMapKey);
  const gKey = gKeyData?.getGoogleMapKey;

  if (loading) return <CircularProgress size={40} />;

  return (
    <>
      {gKey ? (
        <MapComp
          onMapAreaChange={onMapAreaChange}
          radius={radius}
          gKey={gKey}
        />
      ) : (
        <>
          {error && (
            <Alert severity="error" color="error">
              {error.message}
            </Alert>
          )}
        </>
      )}
    </>
  );
};

//TODO: securily store google map key e.g. using Backend Proxy
interface IMapProps extends Props {
  gKey: string;
}
function MapComp({ onMapAreaChange, radius, gKey }: IMapProps) {
  const theme = useTheme();
  const pColor = theme.palette.primary.main;
  const { user } = useUserStates();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [zoom, setZoom] = useState(9);
  const config = {
    minR: 5,
    maxR: 250,
    radiusInKM: radius || 40,
    mToKmConvRate: 1000,
  };
  const [circleOptions, setCircleOptions] = useState<google.maps.CircleOptions>(
    {
      strokeColor: pColor,
      strokeWeight: 2,
      fillColor: pColor,
      fillOpacity: 0.35,
      radius: config.radiusInKM * config.mToKmConvRate,
      draggable: true,
    }
  );

  //set map reference and its center
  useEffect(() => {
    if (user && map) {
      const coords = {
        lat: Number(user.address?.lat),
        lng: Number(user.address?.lng),
      };
      setCenter(coords);
      map?.setCenter(coords);
    }
  }, [user, map]);

  //return area details to parent
  useEffect(() => {
    onMapAreaChange({
      lat: center.lat,
      lng: center.lng,
      radius: circleOptions.radius! / config.mToKmConvRate,
    });
  }, [center, circleOptions.radius]);

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: gKey });
  const onLoad = useCallback((mapI: google.maps.Map) => setMap(mapI), []);

  const onGetUserLocation = () => {
    getUserLocation({
      onSuccess: ({ lat, lng }) => {
        setCenter({ lat, lng });
        map?.setCenter({ lat, lng });
      },
    });
  };

  const handleRadiusChange = (_: any, value: number | number[]) => {
    const rInMeters = Number(value) * config.mToKmConvRate;
    setCircleOptions((pv) => ({ ...pv, radius: rInMeters }));
    const calcdZoom = Math.floor(Math.log2(591657550.5 / rInMeters) - 5);
    setZoom(calcdZoom);
  };

  const handleCircleDragEnd = (e: google.maps.MapMouseEvent) => {
    const center = e.latLng?.toJSON();
    if (center) {
      const newCenter = { lat: center.lat, lng: center.lng };
      setCenter(newCenter);
      map?.setCenter(newCenter);
    }
  };

  return (
    <div style={containerStyle}>
      {gKey && isLoaded ? (
        <>
          <GoogleMap
            onLoad={onLoad}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={{ streetViewControl: false }}
          >
            <CircleF
              center={center}
              options={circleOptions}
              onDragEnd={handleCircleDragEnd}
            />
            <Box sx={locationBtnCont}>
              <IconButton sx={{ color: "grey" }} onClick={onGetUserLocation}>
                <MyLocationIcon />
              </IconButton>
            </Box>
          </GoogleMap>
          <Box sx={{ mx: 4, mt: 1 }}>
            <Slider
              aria-label="Map Circle Radius"
              value={circleOptions.radius! / config.mToKmConvRate}
              onChange={handleRadiusChange}
              min={config.minR}
              max={config.maxR}
              valueLabelDisplay="on"
              getAriaValueText={valueLabelFormat}
              valueLabelFormat={valueLabelFormat}
              sx={{
                "& .MuiSlider-valueLabel": {
                  backgroundColor: pColor,
                },
              }}
            />
          </Box>
        </>
      ) : (
        <CircularProgress size={40} />
      )}
      {loadError && (
        <Alert severity="error" color="error">
          {loadError.message}
        </Alert>
      )}
    </div>
  );
}

export default React.memo(MapAreaSelector);

const valueLabelFormat = (value: number) => `${value} KM`;

const locationBtnCont = {
  position: "absolute",
  bottom: 120,
  right: 10,
  width: 40,
  height: 40,
  backgroundColor: "white",
  borderRadius: 1,
} as SxProps<Theme>;

const containerStyle = {
  minWidth: "370px",
  minHeight: "500px",
};
