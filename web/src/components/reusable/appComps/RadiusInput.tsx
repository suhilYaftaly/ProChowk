import { InputAdornment, Slider, Stack, TextField } from "@mui/material";

import Text from "@reusable/Text";

interface Props {
  radius: number;
  error: string;
  onRadiusChange: (value: number | string) => void;
  maxRadius: number;
  minRadius: number;
}
export default function RadiusInput({
  radius,
  error,
  onRadiusChange,
  minRadius,
  maxRadius,
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
        value={radius}
        type="number"
        onChange={(e) => onRadiusChange(e.target.value)}
        error={Boolean(error)}
        helperText={error}
        required
        inputProps={{ min: minRadius, max: maxRadius }}
        InputProps={{
          endAdornment: <InputAdornment position="end"> km</InputAdornment>,
        }}
      />
      <Slider
        value={Number(radius)}
        onChange={(_, value) => onRadiusChange(Number(value))}
        min={minRadius}
        max={maxRadius}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
    </Stack>
  );
}
