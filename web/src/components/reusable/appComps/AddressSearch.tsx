import { useState, useEffect, ChangeEvent } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Autocomplete, Grid, InputAdornment, TextField } from "@mui/material";

import { getUserLocation } from "@/utils/utilFuncs";
import { IAddressData, useAddressSearch } from "@gqlOps/address";

interface Props {
  onSelect: (address: IAddressData) => void;
}

export default function AddressSearch({ onSelect }: Props) {
  const [userCoord, setUserCoord] = useState({ lat: 0, lng: 0 });
  const { addressSearchAsync, data } = useAddressSearch();

  const onGetUserLocation = () => {
    getUserLocation({
      onSuccess: ({ lat, lng }) => setUserCoord({ lat, lng }),
    });
  };

  useEffect(() => onGetUserLocation(), []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    if (value.length > 4) {
      addressSearchAsync({
        vars: { value, lat: userCoord.lat, lng: userCoord.lng },
      });
    }
  };

  return (
    <Autocomplete
      freeSolo
      id="free-solo-2-demo"
      disableClearable
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.displayName
      }
      options={data?.addressSearch || []}
      onChange={(_, value: any) => onSelect(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Address Search"
          placeholder="23 McSweeney Cres..."
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            type: "search",
            // startAdornment: (
            //   <InputAdornment position="start">
            //     <LocationOnIcon />
            //   </InputAdornment>
            // ),
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
  );
}
