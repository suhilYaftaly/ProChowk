import { SxProps, Theme } from "@mui/material";
import Text from "@reusable/Text";
import { JobInput } from "@gqlOps/job";

interface Props {
  budget: JobInput["budget"];
  sx?: SxProps<Theme>;
}
export default function JobBudgetCost({ budget, sx }: Props) {
  const isHourly = budget?.type === "Hourly";
  return (
    <Text sx={{ mb: 1, fontWeight: 500, ...sx }}>
      {budget?.type}:{" "}
      <Text component={"span"} cColor="primary" sx={{ fontWeight: 600 }}>
        {isHourly && `$${budget?.from}-`}${budget?.to}
      </Text>
      {isHourly && (
        <>
          {" "}
          | Max Hours:{" "}
          <Text component={"span"} cColor="primary" sx={{ fontWeight: 600 }}>
            {budget?.maxHours}hr
          </Text>
        </>
      )}
    </Text>
  );
}
