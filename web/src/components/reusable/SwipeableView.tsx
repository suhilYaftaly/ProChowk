import { useTheme } from "@mui/material";
import React from "react";

interface Props {
  items: React.ReactNode[];
  effect?: "cube" | "slide" | "cards" | "coverflow" | "creative" | "fade";
}

export default ({ items, effect = "slide" }: Props) => {
  const theme = useTheme();
  const swiperStyles = {
    "--swiper-pagination-color": theme.palette.primary.main,
  } as React.CSSProperties;

  return (
    <div style={swiperStyles}>
      <swiper-container slides-per-view="1" pagination="true" effect={effect}>
        {items.map((item, index) => (
          <swiper-slide key={index}>{item}</swiper-slide>
        ))}
      </swiper-container>
    </div>
  );
};
