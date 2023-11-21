import { Typography, TypographyProps, Theme, useTheme } from "@mui/material";

/**
 * Extending the standard TypographyProps to include our custom "type".
 */
interface CustomTextProps extends TypographyProps {
  /**
   * The type prop determines the style preset for the text.
   * - title: Larger 24px, bold text suitable for headings.
   * - subtitle: Medium 19px, semiBold text suitable for subheadings.
   * - body1: Regular 16px text suitable for standard content.
   * - body2: Regular 14px text suitable for standard content.
   * - caption: Smaller 12px, slightly faded text suitable for annotations or less prominent content.
   * @default "is from MUI Typography itself"
   */
  type?: "title" | "subtitle" | "body1" | "body2" | "caption";
  sx?: TypographyProps["sx"];
  /**custom theme color */
  cColor?: "dark" | "main" | "light" | "primary" | "info" | "warning";
}

/** Extending the standard MUI Typography to create a custom "Text" component .*/
export default function Text({
  type,
  sx,
  cColor,
  ...otherProps
}: CustomTextProps) {
  const theme: Theme = useTheme();
  return (
    <Typography
      sx={{ ...getVariantStyles({ type, theme, cColor }), ...sx }}
      {...otherProps}
    />
  );
}

interface StylesProps {
  type: string | undefined;
  theme: Theme;
  cColor?: CustomTextProps["cColor"];
}
const getVariantStyles = ({ type, theme, cColor }: StylesProps) => {
  switch (type) {
    case "title":
      return {
        fontSize: 24,
        fontWeight: 600,
        color: getColor(cColor || "dark", theme),
      };
    case "subtitle":
      return {
        fontSize: 19,
        fontWeight: 450,
        color: getColor(cColor || "dark", theme),
      };
    case "body1":
      return {
        fontSize: 16,
        color: getColor(cColor || "main", theme),
      };
    case "body2":
      return {
        fontSize: 14,
        color: getColor(cColor || "main", theme),
      };
    case "caption":
      return {
        fontSize: 12,
        color: getColor(cColor || "light", theme),
      };
    default:
      return {
        color: getColor(cColor || "main", theme),
      };
  }
};

const getColor = (
  cColor: CustomTextProps["cColor"],
  theme: Theme
): string | undefined => {
  switch (cColor) {
    case "dark":
      return theme.palette.text.dark;
    case "main":
      return theme.palette.text.main;
    case "light":
      return theme.palette.text.light;
    case "primary":
      return theme.palette.primary.main;
    case "info":
      return theme.palette.info.main;
    case "warning":
      return theme.palette.warning.main;
  }
};
