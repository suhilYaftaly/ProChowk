import {
  Autocomplete,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  acOptions: string[];
  acLoading: boolean;
  acOnOpen?: () => void;
  onFilterClick: () => void;
  setSearchText: (text: string) => void;
  /**@default Search */
  label?: string;
  placeholder?: string;
}
export default function SearchBar({
  acOptions,
  acLoading,
  acOnOpen,
  onFilterClick,
  setSearchText,
  label = "Search",
  placeholder,
}: Props) {
  const onTextChange = (_: any, value: string | null) => {
    if (value) setSearchText(value);
  };
  const onInputChange = (_: any, value: string) => {
    setSearchText(value);
  };

  return (
    <Autocomplete
      onOpen={acOnOpen}
      loading={acLoading}
      options={acOptions}
      freeSolo
      onChange={onTextChange}
      onInputChange={onInputChange}
      size="small"
      disableClearable
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {params.InputProps.endAdornment}
                <IconButton onClick={onFilterClick}>
                  <FilterAltIcon color="primary" />
                </IconButton>
                <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
                <IconButton type="submit">
                  <SearchIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
