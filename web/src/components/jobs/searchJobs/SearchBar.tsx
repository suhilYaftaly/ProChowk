import {
  Autocomplete,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  acOptions: string[];
  acLoading: boolean;
  acOnOpen: () => void;
  onFilterClick: () => void;
  setSearchText: (text: string) => void;
}
export default function SearchBar({
  acOptions,
  acLoading,
  acOnOpen,
  onFilterClick,
  setSearchText,
}: Props) {
  const theme = useTheme();

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
      disablePortal
      options={acOptions}
      freeSolo
      onChange={onTextChange}
      onInputChange={onInputChange}
      size="small"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search nearby jobs"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
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
