import { useState, useEffect, ChangeEvent } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Autocomplete, Grid, TextField } from "@mui/material";

import { removeTypename } from "@utils/utilFuncs";
import { IAddress, useGeocode } from "@gqlOps/address";
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
}

export default function AddressSearch({
  onSelect,
  address,
  required = false,
  label = "Address Search",
  helperText,
}: Props) {
  const dispatch = useAppDispatch();
  const { userLocation } = useUserStates();
  const lat = userLocation?.data?.lat;
  const lng = userLocation?.data?.lng;
  const { geocodeAsync, data, loading } = useGeocode();
  const [adr, setAdr] = useState<IAddress | undefined>(address);

  useEffect(() => address && setAdr(getAddressFormat(address)), [address]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    if (value.trim().length > 2) geocodeAsync({ vars: { value, lat, lng } });
  };

  const onAddressSelect = (value: IAddress) => {
    const address = getAddressFormat(value);
    onSelect(address);
    if (!lat && !lng) {
      dispatch(userLocationSuccess({ lat: address.lat, lng: address.lng }));
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
        onChange={(_, value: any) => onAddressSelect(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            value={adr}
            placeholder="23 McSweeney Cres..."
            onChange={handleInputChange}
            autoComplete="off"
            size="small"
            InputProps={{ ...params.InputProps, type: "search" }}
            required={required}
            error={Boolean(helperText)}
            helperText={helperText}
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
  };
};
