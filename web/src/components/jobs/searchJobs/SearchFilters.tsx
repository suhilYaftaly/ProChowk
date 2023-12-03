import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  SwipeableDrawer,
  TextField,
  Tooltip,
  useTheme,
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
  budget: { types: string; from: string; to: string };
}

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
  initialTypes: BudgetType[];
  filters: ISearchFilters;
  setFilters: Dispatch<SetStateAction<ISearchFilters>>;
  filterErrors: ISearchFilterErrors;
  setFilterErrors: Dispatch<SetStateAction<ISearchFilterErrors>>;
  onSearch: () => void;
}
export default function SearchFilters({
  open,
  setOpen,
  initialTypes,
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
    dayPostedIndex: CC.dayPostedIndex,
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
      checkFilterOptionsError({
        filters: newOptions,
        setErrors: setFilterErrors,
      });
      return newOptions;
    });
  };

  const onProjectTypeChange = (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    const name = (event.currentTarget as HTMLInputElement).name as BudgetType;
    setFilters((prev) => {
      const updatedTypes = checked
        ? [...prev.budget.types, name]
        : prev.budget.types.filter((t) => t !== name);
      return { ...prev, budget: { ...prev.budget, types: updatedTypes } };
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

  const onBudgetPriceRangeChange = (_: Event, number: number | number[]) => {
    if (Array.isArray(number)) {
      onBudgetPriceChange(number[0], "from");
      onBudgetPriceChange(number[1], "to");
    }
  };

  const onDateChange = ({ startDate, endDate }: IDateRange) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const resetFilters = () => {
    setFilters({ ...CC.defaults, latLng });
    setResets({
      dayPostedIndex: CC.dayPostedIndex,
      addressDisplay: latLng ? "My Location" : "",
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
          enableMyLocationBtn
        />
      </Stack>
      <Divider sx={{ my: dMy }} />
      <Stack sx={{ mx: px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Radius*
        </Text>
        <TextField
          variant="outlined"
          size="small"
          name={"radius"}
          value={filters.radius}
          type="number"
          onChange={(e) => onRadiusChange(e.target.value)}
          error={Boolean(filterErrors.radius)}
          helperText={filterErrors.radius}
          required
          inputProps={{ min: CC.minRadius, max: CC.maxRadius }}
          InputProps={{
            endAdornment: <InputAdornment position="end"> km</InputAdornment>,
          }}
        />
        <Slider
          value={Number(filters.radius)}
          onChange={(_, value) => onRadiusChange(Number(value))}
          min={CC.minRadius}
          max={CC.maxRadius}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
      </Stack>
      <Divider sx={{ my: dMy }} />
      <FormGroup sx={{ px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Project Type*
        </Text>
        {initialTypes.map((type) => (
          <CheckboxWithLable
            key={type}
            label={type}
            name={type}
            isChecked={filters.budget.types.includes(type)}
            onChange={onProjectTypeChange}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: dMy }} />
      <Stack sx={{ px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Day Posted
        </Text>
        <DayPosted
          onDateChange={onDateChange}
          selectedIndes={resets.dayPostedIndex}
        />
      </Stack>

      <Divider sx={{ my: dMy }} />
      <Stack sx={{ mx: px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Price Range*
        </Text>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <TextField
            variant="outlined"
            size="small"
            name={"from"}
            value={filters.budget.from}
            type="number"
            onChange={(e) => onBudgetPriceChange(e.target.value, "from")}
            error={Boolean(filterErrors.budget.from)}
            helperText={filterErrors.budget.from}
            required
            sx={{ width: 127 }}
            inputProps={{ min: CC.budget.fromMin }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            size="small"
            name={"to"}
            value={filters.budget.to}
            type="number"
            onChange={(e) => onBudgetPriceChange(e.target.value, "to")}
            error={Boolean(filterErrors.budget.to)}
            helperText={filterErrors.budget.to}
            required
            sx={{ width: 127 }}
            inputProps={{ min: CC.budget.toMin }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Stack>
        <Slider
          value={[Number(filters.budget.from), Number(filters.budget.to)]}
          onChange={onBudgetPriceRangeChange}
          min={CC.budget.fromMin}
          max={CC.budget.toMax}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
      </Stack>
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
    budget: { types, from, to },
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

  //budget project type check
  if (types.length < 1) {
    const errMsg = `At least 1 Project type must be selected`;
    setErrors((prev) => ({
      ...prev,
      budget: { ...prev.budget, type: errMsg },
    }));
    errors.push(errMsg);
  } else
    setErrors((prev) => ({ ...prev, budget: { ...prev.budget, type: "" } }));

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

interface ICheckboxWithLable {
  isChecked: boolean;
  label: string;
  name: string;
  onChange:
    | ((event: React.SyntheticEvent<Element, Event>, checked: boolean) => void)
    | undefined;
}
const CheckboxWithLable = ({
  isChecked,
  label,
  name,
  onChange,
}: ICheckboxWithLable) => {
  const theme = useTheme();
  const darkTxColor = theme.palette.text.dark;
  const color = isChecked ? darkTxColor : undefined;
  return (
    <FormControlLabel
      key={name}
      control={<Checkbox name={name} sx={{ color }} color="default" />}
      label={label}
      checked={isChecked}
      onChange={onChange}
      componentsProps={{
        typography: {
          fontSize: 14,
          color,
          fontWeight: isChecked ? "600" : undefined,
        },
      }}
    />
  );
};
