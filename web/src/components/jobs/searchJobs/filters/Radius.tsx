import { InputAdornment, Slider, Stack, TextField } from "@mui/material";

import Text from "@reusable/Text";
import { ISearchFilterErrors, ISearchFilters } from "../SearchFilters";
import { searchFilterConfigs as CC } from "@config/configConst";

interface Props {
  filters: ISearchFilters;
  filterErrors: ISearchFilterErrors;
  onRadiusChange: (value: number | string) => void;
}
export default function Radius({
  filters,
  filterErrors,
  onRadiusChange,
}: Props) {
  return (
    <Stack sx={{ mx: 2 }}>
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
  );
}
