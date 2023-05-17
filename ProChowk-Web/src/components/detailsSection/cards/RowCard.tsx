import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Rating,
} from "@mui/material";

import "../../../App.css";
import { useGetSSV } from "../../../utils/hooks";

export interface CardProps {
  title: string;
  subtitle: string;
  img: string;
  imgAlt: string;
  price?: string;
  rating: {
    stars: number;
    totalRates: number;
  };
  [key: string]: any;
}

export default function RowCard({
  title,
  subtitle,
  img,
  imgAlt,
  // price,
  rating,
}: CardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: useGetSSV(undefined, 250),
        display: useGetSSV("flex", "block"),
      }}
    >
      <Box boxShadow={1} sx={{ display: "flex", justifyContent: "center" }}>
        <CardMedia
          component="img"
          sx={{
            width: useGetSSV(140, 250),
            height: useGetSSV(140, 200),
            minWidth: "100%",
            minHeight: "100%",
            objectFit: "cover",
          }}
          image={img}
          alt={imgAlt}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: useGetSSV(undefined, 120),
        }}
      >
        <CardContent sx={{ padding: 1 }}>
          <Typography variant="subtitle2" className="ellipsis1Line">
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            className="ellipsis2Line"
          >
            {subtitle}
          </Typography>
        </CardContent>
        <Box>
          {/* {price && (
            <Typography variant="h6" sx={{ padding: 1, paddingBottom: 0 }}>
              ${price}
            </Typography>
          )} */}
          <Stack direction={"row"} sx={{ padding: 1 }}>
            <Typography variant="caption" color={theme.palette.primary.main}>
              {rating.stars}
            </Typography>
            <Rating
              name={rating.stars + " stars out of 5"}
              value={rating.stars}
              precision={0.5}
              readOnly
              size="small"
              sx={{ marginX: "1px" }}
            />
            <Typography variant="caption" color="text.secondary">
              ({rating.totalRates})
            </Typography>
          </Stack>
          {/* <CardActions disableSpacing sx={{ padding: 0 }}>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions> */}
        </Box>
      </Box>
    </Card>
  );
}
