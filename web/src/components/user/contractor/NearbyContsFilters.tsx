import {
  SwipeableDrawer,
  Stack,
  Tooltip,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Refresh, Search, FilterAlt } from "@mui/icons-material";

import RadiusInput from "@/components/reusable/appComps/RadiusInput";
import AddressSearch from "@reusable/appComps/AddressSearch";
import { nearbyContsFilterConfigs as CC } from "@/config/configConst";
import { useUserStates } from "@/redux/reduxStates";
import { IAddress, LatLngInput } from "@gqlOps/address";
import Text from "@reusable/Text";

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
  filters: INearbyContFilters;
  setFilters: Dispatch<SetStateAction<INearbyContFilters>>;
  filterErrors: INearbyContFilterErrors;
  setFilterErrors: Dispatch<SetStateAction<INearbyContFilterErrors>>;
  onSearch: () => void;
}
export default function NearbyContsFilters({
  open,
  setOpen,
  setFilters,
  filters,
  setFilterErrors,
  filterErrors,
  onSearch,
}: Props) {
  /**horizontal padding */
  const px = 2;
  /**divider margin vertical */
  const dMy = 2;
  const { userLocation } = useUserStates();
  const latLng = userLocation?.data;
  const [resets, setResets] = useState({
    addressDisplay: latLng ? "My Location" : "",
  });

  useEffect(() => {
    if (latLng) {
      setResets((prev) => ({
        ...prev,
        addressDisplay: latLng ? "My Location" : "",
      }));
    }
  }, [latLng]);

  const toggleDrawer = () => setOpen(!open);

  const onRadiusChange = (value: number | string) => {
    setFilters((prev) => {
      const newOptions = { ...prev, radius: value as number };
      checkNearbyContsFilters({
        filters: newOptions,
        setErrors: setFilterErrors,
      });
      return newOptions;
    });
  };

  const onAddressSelect = (address: IAddress) => {
    setFilters((prev) => {
      const newOptions = {
        ...prev,
        address,
        latLng: { lat: address.lat, lng: address.lng },
      } as INearbyContFilters;
      checkNearbyContsFilters({
        filters: newOptions,
        setErrors: setFilterErrors,
      });
      return newOptions;
    });
  };

  const resetFilters = () => {
    setFilters({ ...CC.defaults, latLng });
    setResets({ addressDisplay: latLng ? "My Location" : "" });
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          px,
          pt: px,
          minWidth: 300,
          justifyContent: "space-between",
        }}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <FilterAlt sx={{ mr: 2 }} />
          <Text type="subtitle" sx={{ fontWeight: 650 }}>
            Filters
          </Text>
        </Stack>
        <Tooltip title="Reset Filters">
          <IconButton onClick={resetFilters} color="inherit">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider sx={{ my: dMy }} />
      <Stack sx={{ px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Location
        </Text>
        <AddressSearch
          label=""
          value={resets.addressDisplay}
          setValue={(val) =>
            setResets((prev) => ({ ...prev, addressDisplay: val }))
          }
          address={filters?.address}
          onSelect={onAddressSelect}
          helperText={filterErrors.address}
          myLocationType="userLatLng"
          onMyLocation={({ lat, lng }) =>
            setFilters((prev) => ({ ...prev, latLng: { lat, lng } }))
          }
        />
      </Stack>
      <Divider sx={{ my: dMy }} />
      <RadiusInput
        radius={filters.radius}
        error={filterErrors.radius}
        onRadiusChange={onRadiusChange}
        minRadius={CC.minRadius}
        maxRadius={CC.maxRadius}
      />

      <Divider sx={{ my: dMy }} />
      <Button
        variant="contained"
        onClick={onSearch}
        sx={{ mx: px, mb: 2 }}
        endIcon={<Search />}
      >
        Search
      </Button>
    </SwipeableDrawer>
  );
}

export interface INearbyContFilters {
  radius: number;
  address?: IAddress;
  latLng?: LatLngInput;
}
export interface INearbyContFilterErrors {
  radius: string;
  address?: string;
}

interface ICheckFilterOptions {
  filters: INearbyContFilters;
  setErrors: Dispatch<SetStateAction<INearbyContFilterErrors>>;
}
export const checkNearbyContsFilters = ({
  filters,
  setErrors,
}: ICheckFilterOptions) => {
  let errors = [];
  const { radius, latLng } = filters;

  //location check
  if (!latLng?.lat && !latLng?.lng) {
    const errMsg = `A location must be selected.`;
    setErrors((prev) => ({ ...prev, address: errMsg }));
    errors.push(errMsg);
  } else setErrors((prev) => ({ ...prev, address: "" }));

  //radius check
  if (radius < CC.minRadius || radius > CC.maxRadius) {
    const errMsg = `Radius must be between ${CC.minRadius}KM and ${CC.maxRadius}KM.`;
    setErrors((prev) => ({ ...prev, radius: errMsg }));
    errors.push(errMsg);
  } else setErrors((prev) => ({ ...prev, radius: "" }));

  return errors;
};
