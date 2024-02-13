import { TReview, TUserReviewsData } from "@gqlOps/review";
import {
  Avatar,
  Card,
  CardActionArea,
  Divider,
  Grid,
  Rating,
  Stack,
} from "@mui/material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useIsMobile } from "@/utils/hooks/hooks";
import SwipeableView from "@reusable/SwipeableView";
import Text from "@reusable/Text";
import { navigateToUserPage } from "@/utils/utilFuncs";

//TODO: add see more reviews
type Props = { reviewsData: TUserReviewsData; p: number; tmb: number };
export default function UserReviews({ p, tmb, reviewsData }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const avatarSize = 40;
  const reviews = reviewsData?.reviews;
  const totalCount = reviewsData?.totalCount;

  const card = (review: TReview) => {
    const reviewer = review?.reviewer;
    const timeAgo =
      review.updatedAt &&
      formatDistanceToNow(parseISO(review.updatedAt), { addSuffix: true });

    return (
      <Card variant="outlined">
        <CardActionArea
          sx={{ p, borderRadius: 0 }}
          onClick={() => navigateToUserPage({ navigate, user: reviewer })}
        >
          <Stack direction={"row"}>
            <Avatar
              alt={reviewer?.name}
              src={reviewer?.image?.url}
              sx={{ width: avatarSize, height: avatarSize, mr: 1 }}
            />
            <Stack>
              <Text type="subtitle" sx={{ fontSize: 16 }}>
                {reviewer?.name}
              </Text>
              <Text type="caption">{timeAgo}</Text>
            </Stack>
          </Stack>
        </CardActionArea>
        <Divider />
        <Stack sx={{ p }}>
          <Rating value={review.rating} readOnly />
          <Text
            sx={{ mt: 0.5, whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          >
            {review.comment}
          </Text>
        </Stack>
      </Card>
    );
  };

  return (
    <Stack sx={{ p }}>
      <Text type="subtitle" sx={{ my: tmb }}>
        Reviews ({totalCount})
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
