import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  SwipeableDrawer,
  TextField,
  useTheme,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { SetStateAction, Dispatch } from "react";

import Text from "@reusable/Text";
import AddressSearch from "@appComps/AddressSearch";
import { IAddress, LatLngInput } from "@gqlOps/address";
import { BudgetType } from "@gqlOps/job";
import { searchFilterConfigs as CC } from "@config/configConst";

export interface ISearchFilters {
  radius: number;
  address?: IAddress;
  latLng?: LatLngInput;
  budget: { types: BudgetType[]; maxHours: number };
}
export interface ISearchFilterErrors {
  radius: string;
  address?: string;
  budget: { types: string; maxHours: string };
}

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
  initialTypes: BudgetType[];
  filters: ISearchFilters;
  setFilters: Dispatch<SetStateAction<ISearchFilters>>;
  filterErrors: ISearchFilterErrors;
  setFilterErrors: Dispatch<SetStateAction<ISearchFilterErrors>>;
}
export default function SearchFilters({
  open,
  setOpen,
  initialTypes,
  setFilters,
  filters,
  setFilterErrors,
  filterErrors,
}: Props) {
  /**horizontal padding */
  const px = 2;

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

  const onBudgetMaxHoursChange = (value: number | string) => {
    const maxHours = value as number;
    setFilters((prev) => {
      const newOptions = { ...prev, budget: { ...prev.budget, maxHours } };
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

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "center", px, pt: px, minWidth: 270 }}
      >
        <FilterAltIcon sx={{ mr: 2 }} />
        <Text type="subtitle">Filters</Text>
      </Stack>
      <Divider sx={{ my: px }} />
      <Stack sx={{ px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Location
        </Text>
        <AddressSearch
          label=""
          address={filters?.address}
          onSelect={onAddressSelect}
          helperText={filterErrors.address}
        />
      </Stack>
      <Divider sx={{ my: px }} />
      <Stack sx={{ mx: px }}>
        <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
          Radius (KM)*
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
      <Divider sx={{ my: px }} />
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
      {filters.budget.types.includes("Hourly") && (
        <>
          <Divider sx={{ my: px }} />
          <Stack sx={{ mx: px }}>
            <Text type="title" sx={{ fontSize: 16, mb: 1 }}>
              Project Max Hours*
            </Text>
            <TextField
              variant="outlined"
              size="small"
              name={"maxHours"}
              value={filters.budget.maxHours}
              type="number"
              onChange={(e) => onBudgetMaxHoursChange(e.target.value)}
              error={Boolean(filterErrors.budget.maxHours)}
              helperText={filterErrors.budget.maxHours}
              required
              inputProps={{
                min: CC.budget.minMaxHours,
                max: CC.budget.maxMaxHours,
              }}
            />
            <Slider
              value={Number(filters.budget.maxHours)}
              onChange={(_, value) => onBudgetMaxHoursChange(Number(value))}
              min={CC.budget.minMaxHours}
              max={CC.budget.maxMaxHours}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
          </Stack>
        </>
      )}
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
  let error = false;
  const {
    radius,
    latLng,
    budget: { maxHours },
  } = filters;

  if (radius < CC.minRadius || radius > CC.maxRadius) {
    setErrors((prev) => ({
      ...prev,
      radius: `Must be between ${CC.minRadius}KM and ${CC.maxRadius}KM.`,
    }));
    error = true;
  } else setErrors((prev) => ({ ...prev, radius: "" }));

  if (!latLng?.lat && !latLng?.lng) {
    setErrors((prev) => ({ ...prev, address: `A location must be selected.` }));
    error = true;
  } else setErrors((prev) => ({ ...prev, address: "" }));

  if (maxHours < CC.budget.minMaxHours || maxHours > CC.budget.maxMaxHours) {
    setErrors((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        maxHours: `Must be between ${CC.budget.minMaxHours} and ${CC.budget.maxMaxHours}.`,
      },
    }));
    error = true;
  } else {
    setErrors((prev) => ({
      ...prev,
      budget: { ...prev.budget, maxHours: "" },
    }));
  }

  return error;
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
