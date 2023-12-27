import {
  Button,
  Divider,
  IconButton,
  Stack,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SetStateAction, Dispatch, useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import Text from "@reusable/Text";
import AddressSearch from "@appComps/AddressSearch";
import { IAddress, LatLngInput } from "@gqlOps/address";
import { BudgetType } from "@gqlOps/job";
import { searchFilterConfigs as CC } from "@config/configConst";
import { useUserStates } from "@/redux/reduxStates";
import DayPosted, { IDateRange } from "./filters/DayPosted";
import PriceRange from "./filters/PriceRange";
import Radius from "./filters/Radius";
import ProjectType from "./filters/ProjectType";

export interface ISearchFilters {
  radius: number;
  address?: IAddress;
  latLng?: LatLngInput;
  startDate?: string;
  endDate?: string;
  budget: { types: BudgetType[]; from: number; to: number };
}
export interface ISearchFilterErrors {
  radius: string;
  address?: string;
  budget: { from: string; to: string };
}

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
  filters: ISearchFilters;
  setFilters: Dispatch<SetStateAction<ISearchFilters>>;
  filterErrors: ISearchFilterErrors;
  setFilterErrors: Dispatch<SetStateAction<ISearchFilterErrors>>;
  onSearch: () => void;
}
export default function SearchFilters({
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
    dayPostedIndex: CC.dayPostedIndex as number | undefined,
    addressDisplay: latLng ? "My Location" : "",
    projectTypeIndex: CC.projectTypeIndex as number | undefined,
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
      checkFilterOptionsError({
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
      } as ISearchFilters;
      checkFilterOptionsError({
        filters: newOptions,
        setErrors: setFilterErrors,
      });
      return newOptions;
    });
  };

  const onBudgetPriceChange = (value: number | string, name: "from" | "to") => {
    const price = value as number;
    setFilters((prev) => {
      const newOptions = { ...prev, budget: { ...prev.budget, [name]: price } };
      checkFilterOptionsError({
        filters: newOptions,
        setErrors: setFilterErrors,
      });
      return newOptions;
    });
  };

  const onBudgetTypeChange = (types: BudgetType[]) => {
    setResets((prev) => ({ ...prev, projectTypeIndex: undefined }));
    setFilters((prev) => ({ ...prev, budget: { ...prev.budget, types } }));
  };

  const onDateChange = ({ startDate, endDate }: IDateRange) => {
    setResets((prev) => ({ ...prev, dayPostedIndex: undefined }));
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const resetFilters = () => {
    setFilters({ ...CC.defaults, latLng });
    setResets({
      dayPostedIndex: CC.dayPostedIndex,
      addressDisplay: latLng ? "My Location" : "",
      projectTypeIndex: CC.projectTypeIndex,
    });
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
          <FilterAltIcon sx={{ mr: 2 }} />
          <Text type="subtitle" sx={{ fontWeight: 650 }}>
            Filters
          </Text>
        </Stack>
        <Tooltip title="Reset Filters">
          <IconButton onClick={resetFilters} color="inherit">
            <RefreshIcon />
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
      <Radius
        filters={filters}
        filterErrors={filterErrors}
        onRadiusChange={onRadiusChange}
      />

      <Divider sx={{ my: dMy }} />
      <ProjectType
        onTypesChange={onBudgetTypeChange}
        index={resets.projectTypeIndex}
      />

      <Divider sx={{ my: dMy }} />
      <DayPosted
        onDateChange={onDateChange}
        selectedIndex={resets.dayPostedIndex}
      />

      <Divider sx={{ my: dMy }} />
      <PriceRange
        filters={filters}
        filterErrors={filterErrors}
        onPriceChange={onBudgetPriceChange}
      />

      <Divider sx={{ my: dMy }} />
      <Button
        variant="contained"
        onClick={onSearch}
        sx={{ mx: px, mb: 2 }}
        endIcon={<SearchIcon />}
      >
        Search
      </Button>
    </SwipeableDrawer>
  );
}

interface ICheckFilterOptions {
  filters: ISearchFilters;
  setErrors: Dispatch<SetStateAction<ISearchFilterErrors>>;
}
export const checkFilterOptionsError = ({
  filters,
  setErrors,
}: ICheckFilterOptions) => {
  let errors = [];
  const {
    radius,
    latLng,
    budget: { from, to },
  } = filters;

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

  //budget price from check
  if (from < CC.budget.fromMin) {
    const errMsg = `From range must be more than ${CC.budget.fromMin}.`;
    setErrors((prev) => ({
      ...prev,
      budget: { ...prev.budget, from: errMsg },
    }));
    errors.push(errMsg);
  } else if (Number(from) > Number(to)) {
    const errMsg = `From range cannot be greater than To range.`;
    setErrors((prev) => ({
      ...prev,
      budget: { ...prev.budget, from: errMsg },
    }));
    errors.push(errMsg);
  } else {
    setErrors((prev) => ({ ...prev, budget: { ...prev.budget, from: "" } }));
  }

  //budget price tp check
  if (to < CC.budget.toMin) {
    const errMsg = `To range must be more than ${CC.budget.toMin}.`;
    setErrors((prev) => ({ ...prev, budget: { ...prev.budget, to: errMsg } }));
    errors.push(errMsg);
  } else {
    setErrors((prev) => ({ ...prev, budget: { ...prev.budget, to: "" } }));
  }

  return errors;
};
