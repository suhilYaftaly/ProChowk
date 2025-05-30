import { useState, useEffect, ChangeEvent } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Autocomplete,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import {
  getUserLocation,
  removeServerMetadata,
  removeTypename,
} from "@utils/utilFuncs";
import {
  IAddress,
  IGeoAddress,
  ILatLng,
  useGeocode,
  useReverseGeocode,
} from "@gqlOps/address";
import { useUserStates } from "@/redux/reduxStates";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { userLocationSuccess } from "@rSlices/userSlice";

interface Props {
  onSelect: (address: IAddress) => void;
  address?: IAddress;
  required?: boolean;
  /**Text Field label @default "Address Search" */
  label?: string;
  /**Text Field helper text to show error message */
  helperText?: string;
  /**The value of the autocomplete. */
  value?: string;
  setValue?: (value: string) => void;
  onMyLocation?: ({ lat, lng }: ILatLng) => void;
  /**Type of data to get back on my location click */
  myLocationType?: "userLatLng";
}

export default function AddressSearch({
  onSelect,
  address,
  required = false,
  label = "Address Search",
  helperText,
  value,
  setValue,
  onMyLocation,
  myLocationType,
}: Props) {
  const dispatch = useAppDispatch();
  const { userLocation } = useUserStates();
  const lat = userLocation?.data?.lat;
  const lng = userLocation?.data?.lng;
  const { geocodeAsync, data, loading } = useGeocode();
  const { reverseGeocodeAsync, loading: rGeoLoading } = useReverseGeocode();
  const [adr, setAdr] = useState<IAddress | undefined>(address);
  const [displayVal, setDisplayVal] = useState(value || "");

  useEffect(() => {
    if (address) {
      const formattedAdr = getAddressFormat(address);
      setAdr(formattedAdr);
      setValue && setValue(formattedAdr.displayName);
      setDisplayVal(formattedAdr.displayName);
    } else if (setValue) setValue(value || "");
  }, [address]);

  useEffect(() => {
    if (value) setDisplayVal(value);
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value: targValue } = e.target;
    if (targValue.trim().length > 2 && targValue.length > displayVal.length)
      geocodeAsync({ vars: { value: targValue, lat, lng } });
    setDisplayVal(targValue);
    setValue && setValue(targValue);
  };

  const onMyLocationClick = () => {
    getUserLocation({
      onSuccess: ({ lat, lng }) => {
        dispatch(userLocationSuccess({ lat, lng }));
        onMyLocation && onMyLocation({ lat, lng });
        if (myLocationType !== "userLatLng") {
          reverseGeocodeAsync({
            variables: { lat, lng },
            onSuccess: (data) => {
              const cleanedAdr = removeServerMetadata(data);
              onSelect(getAddressFormat(cleanedAdr));
            },
          });
        }
      },
    });
  };

  return (
    <>
      <Autocomplete
        freeSolo
        value={value || displayVal || ""}
        loading={loading}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.displayName
        }
        options={data?.geocode || []}
        onChange={(_, value: any) => onSelect(getAddressFormat(value))}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            value={adr}
            placeholder="16 Glennie Dr..."
            onChange={handleInputChange}
            autoComplete="off"
            size="small"
            required={required}
            error={Boolean(helperText)}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              type: "search",
              endAdornment: (
                <InputAdornment position="end">
                  {rGeoLoading ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : (
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={onMyLocationClick}
                    >
                      <MyLocationIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option: any) => (
          <li {...props}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item sx={{ display: "flex", gap: 1 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
                {option.displayName}
              </Grid>
            </Grid>
          </li>
        )}
      />
    </>
  );
}

export const getAddressFormat = (adr: IAddress) => {
  return {
    displayName: adr.displayName,
    street: adr.street,
    city: adr.city,
    county: adr.county,
    state: adr.state,
    stateCode: adr.stateCode,
    postalCode: adr.postalCode,
    country: adr.country,
    countryCode: adr.countryCode,
    lat: adr.lat,
    lng: adr.lng,
    geometry: removeTypename(adr.geometry),
  } as IGeoAddress;
};
