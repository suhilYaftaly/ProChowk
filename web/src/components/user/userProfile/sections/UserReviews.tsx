import { TReview } from "@gqlOps/review";
import { Card, Grid, Rating, Stack } from "@mui/material";

import { useIsMobile } from "@/utils/hooks/hooks";
import SwipeableView from "@reusable/SwipeableView";
import Text from "@reusable/Text";

type Props = { reviews: TReview[]; p: number; tmb: number };
export default function UserReviews({ reviews, p, tmb }: Props) {
  const isMobile = useIsMobile();

  const card = (review: TReview) => (
    <Card variant="outlined" sx={{ p }}>
      <Rating value={review.rating} readOnly />
      <Text sx={{ mt: 1, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {review.comment}
      </Text>
    </Card>
  );

  return (
    <Stack sx={{ p }}>
      <Text type="subtitle" sx={{ my: tmb }}>
        Reviews ({reviews.length})
      </Text>
      {isMobile ? (
        <SwipeableView
          items={reviews.map((review) => (
            <Stack key={review.id}>
              <Stack sx={{ borderRadius: 2 }}>{card(review)}</Stack>
            </Stack>
          ))}
        />
      ) : (
        <Grid container spacing={1} direction={"row"}>
          {reviews.map((review) => (
            <Grid item key={review.id} sx={{ maxWidth: 250 }}>
              {card(review)}
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
