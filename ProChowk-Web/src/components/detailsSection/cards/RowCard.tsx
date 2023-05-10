import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import Rating from "@mui/material/Rating";

import "../../../App.css";

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
  price,
  rating,
}: CardProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <Card sx={{ maxWidth: 345, display: isSmallScreen ? "flex" : "block" }}>
      <Box
        boxShadow={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          maxHeight: !isSmallScreen ? 150 : undefined,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={img}
          alt={imgAlt}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: !isSmallScreen ? 200 : undefined,
        }}
      >
        <CardContent sx={{ padding: 1 }}>
          <Typography variant="subtitle2" className="ellipsis2Line">
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
        <div>
          {price && (
            <Typography variant="h6" sx={{ padding: 1 }}>
              ${price}
            </Typography>
          )}
          <Stack direction={"row"} sx={{ paddingX: 1 }}>
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
          <CardActions disableSpacing sx={{ padding: 0 }}>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </div>
      </Box>
    </Card>
  );
}
