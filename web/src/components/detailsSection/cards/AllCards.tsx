import { Grid } from "@mui/material";

import RowCard, { CardProps } from "./RowCard";
import buildNowImg from "../../../assets/serviceImgs/buildNow.jpg";
import demiriImg from "../../../assets/serviceImgs/demiri.jpg";
import trtImg from "../../../assets/serviceImgs/TRT.png";
import roofing from "../../../assets/serviceImgs/roofing.png";
import pixelWatch from "../../../assets/serviceImgs/pixelWatch.jpg";
import pixel7 from "../../../assets/serviceImgs/pixel7.jpg";

export default function AllCards() {
  return (
    <Grid
      container
      paddingX={1}
      paddingY={2}
      spacing={2}
      justifyContent={"center"}
      columns={{ sm: 1, md: 4, lg: 12 }}
    >
      {cards?.map((card) => (
        <Grid key={card.id} item>
          <RowCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}

const cards = [
  {
    id: 1,
    title: "Pixel Watch",
    subtitle:
      "Stainless Steel Magnetic Metal Strap Quick Release Replacement Wristband Bracelet Milanese Sport Loop for Google Pixel Watch Band (Silver)",
    img: pixelWatch,
    imgAlt: "pixel watch",
    rating: {
      stars: 4,
      totalRates: 55,
    },
    price: 255,
  },
  {
    id: 2,
    title: "Google Pixel 7 Pro 5G",
    subtitle:
      "128GB 12GB RAM 24-Hour Battery Universal Unlocked for All Carriers-Obsidian",
    img: pixel7,
    imgAlt: "pixel7",
    price: 1299.99,
    rating: {
      stars: 4.5,
      totalRates: 155,
    },
  },
  {
    id: 3,
    title: "TRT Masonry & General Contracting",
    subtitle: "General Contractors",
    img: trtImg,
    imgAlt: "TRT",
    rating: {
      stars: 4,
      totalRates: 1551,
    },
  },
  {
    id: 10,
    title: "Luc's Roofing Ltd",
    subtitle: "Roofing | 68 Church St. Toronto ON M9N 1N3",
    img: roofing,
    imgAlt: "roofing",
    rating: {
      stars: 2.5,
      totalRates: 4455,
    },
  },
  {
    id: 4,
    title: "Build Now Construction",
    subtitle: "General Contracting and construction",
    img: buildNowImg,
    imgAlt: "img alt temp",
    rating: {
      stars: 3,
      totalRates: 525,
    },
  },
  {
    id: 5,
    title: "Demiri Painting & Decorating",
    subtitle: "Paint & Wallpaper Contractors",
    img: demiriImg,
    imgAlt: "img alt temp",
    rating: {
      stars: 3.5,
      totalRates: 55,
    },
  },
] as CardProps[];
