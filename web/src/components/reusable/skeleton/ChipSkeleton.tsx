import { Skeleton } from "@mui/material";

export default function ChipSkeleton() {
  return (
    <Skeleton
      variant="circular"
      width={60}
      height={25}
      sx={{ borderRadius: 5 }}
    />
  );
}
