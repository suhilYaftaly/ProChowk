import { InputAdornment, Stack, TextField } from "@mui/material";

import Text from "@reusable/Text";
import { ISearchFilterErrors, ISearchFilters } from "../SearchFilters";
import { searchFilterConfigs as CC } from "@config/configConst";

interface Props {
  filters: ISearchFilters;
  filterErrors: ISearchFilterErrors;
  onPriceChange: (value: number | string, name: "from" | "to") => void;
}

export default function PriceRange({
  filters,
  filterErrors,
  onPriceChange,
}: Props) {
  return (
    <Stack sx={{ mx: 2 }}>
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
          onChange={(e) => onPriceChange(e.target.value, "from")}
          error={Boolean(filterErrors.budget.from)}
          helperText={filterErrors.budget.from}
          required
          sx={{ width: 127 }}
          inputProps={{ min: CC.budget.fromMin }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          variant="outlined"
          size="small"
          name={"to"}
          value={filters.budget.to}
          type="number"
          onChange={(e) => onPriceChange(e.target.value, "to")}
          error={Boolean(filterErrors.budget.to)}
          helperText={filterErrors.budget.to}
          required
          sx={{ width: 127 }}
          inputProps={{ min: CC.budget.toMin }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Stack>
    </Stack>
  );
}
