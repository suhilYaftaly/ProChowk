import { useState, useEffect, ChangeEvent } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Alert, Autocomplete, Grid, TextField } from "@mui/material";

import { getUserLocation, removeTypename } from "@utils/utilFuncs";
import { IAddress, useGeocode } from "@gqlOps/address";

interface Props {
  onSelect: (address: IAddress) => void;
  address?: IAddress;
  required?: boolean;
}

export default function AddressSearch({
  onSelect,
  address,
  required = false,
}: Props) {
  const [userCoord, setUserCoord] = useState({ lat: 0, lng: 0 });
  const { geocodeAsync, data, error, loading } = useGeocode();
  const [adr, setAdr] = useState<IAddress | undefined>(address);

  const onGetUserLocation = () => {
    getUserLocation({
      onSuccess: ({ lat, lng }) => setUserCoord({ lat, lng }),
    });
  };

  useEffect(() => address && setAdr(getAddressFormat(address)), [address]);
  useEffect(() => onGetUserLocation(), []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    if (value.length > 4) {
      geocodeAsync({
        vars: { value, lat: userCoord.lat, lng: userCoord.lng },
      });
    }
  };

  return (
    <>
      <Autocomplete
        freeSolo
        value={adr?.displayName || ""}
        loading={loading}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.displayName
        }
        options={data?.geocode || []}
        disableClearable
        onChange={(_, value: any) => onSelect(getAddressFormat(value))}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Address Search"
            value={adr}
            placeholder="23 McSweeney Cres..."
            onChange={handleInputChange}
            autoComplete="off"
            InputProps={{
              ...params.InputProps,
              type: "search",
              // startAdornment: (
              //   <InputAdornment position="start">
              //     <LocationOnIcon />
              //   </InputAdornment>
              // ),
            }}
            required={required}
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
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
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
  };
};
