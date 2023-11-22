import { Box, Stack, SxProps, Theme, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Text from "../Text";

interface Props {
  title?: string;
}
export default function NoSearchResultsWidget({
  title = "No results found!",
}: Props) {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  return (
    <Box sx={{ justifyContent: "center", display: "flex", my: 5 }}>
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <Stack
          direction={"row"}
          sx={{
            border: "1px solid",
            borderRadius: 1,
            p: 1,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={boxStyles} />
          <SearchIcon color="primary" sx={{ ml: 5 }} />
        </Stack>
        <Box sx={{ ...boxStyles, backgroundColor: primaryC }} />
        <Box sx={{ ...boxStyles, width: "70%" }} />
        <Box sx={{ ...boxStyles, width: "60%" }} />
        <div style={{ textAlign: "center" }}>
          <Text type="title" sx={{ my: 1 }}>
            {title}
          </Text>
          <Text type="subtitle" cColor="light">
            Please change your search criteria
          </Text>
        </div>
      </Stack>
    </Box>
  );
}

const boxStyles: SxProps<Theme> = {
  height: 15,
  backgroundColor: "#E6E6E6",
  borderRadius: 5,
  width: "100%",
};
