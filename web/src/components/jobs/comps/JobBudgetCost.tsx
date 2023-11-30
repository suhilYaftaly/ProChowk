import Text from "@reusable/Text";
import { JobInput } from "@gqlOps/job";

interface Props {
  budget: JobInput["budget"];
}
export default function JobBudgetCost({ budget }: Props) {
  return (
    <Text type="body2" sx={{ mb: 1, fontWeight: "600" }}>
      {budget?.type}:{" "}
      <span style={{ opacity: 0.8 }}>
        ${budget?.from}-${budget?.to}
      </span>
      {budget?.type === "Hourly" && (
        <>
          {" "}
          | Max Hours:{" "}
          <span style={{ opacity: 0.8 }}>{budget?.maxHours}Hrs</span>
        </>
      )}
    </Text>
  );
}
