import { Button } from "@mui/material";
import { userLocationLearnMoreLink } from "@constants/links";
import labels from "@constants/labels";

export default function NoUserLocationMsg() {
  const onLearnMore = () =>
    window.open(userLocationLearnMoreLink, "_blank", "noreferrer");

  return (
    <>
      {labels.appName} does not have permission to use your location.
      <Button onClick={onLearnMore}>Learn More</Button>
    </>
  );
}
