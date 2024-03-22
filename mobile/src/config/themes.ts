import myTokens from './tokens';
import { themes } from '@tamagui/themes';

const nexaBindLight = {
  primaryColor: myTokens.color.primary,
  background: myTokens.color.bg,
  backgroundHover: myTokens.color.bg,
  backgroundPress: myTokens.color.bg,
  backgroundFocus: myTokens.color.bg,
  borderColor: myTokens.color.border,
  borderColorHover: myTokens.color.black,
  color: myTokens.color.textBlue,
  colorHover: myTokens.color.black,
  colorPress: myTokens.color.textBlue,
  colorFocus: myTokens.color.textDark,
  shadowColor: myTokens.color.black,
  shadowColorHover: myTokens.color.black,
};

// note: we set up a single consistent base type to validate the rest:
type BaseTheme = typeof nexaBindLight;

// the rest of the themes use BaseTheme
const nexaBindDark: BaseTheme = {
  primaryColor: myTokens.color.secondary,
  background: myTokens.color.secondary,
  backgroundHover: myTokens.color.secondary,
  backgroundPress: myTokens.color.secondary,
  backgroundFocus: myTokens.color.secondary,
  borderColor: myTokens.color.textBlue,
  borderColorHover: myTokens.color.textBlue,
  color: myTokens.color.white,
  colorHover: myTokens.color.white,
  colorPress: myTokens.color.silver,
  colorFocus: myTokens.color.silver,
  shadowColor: myTokens.color.white,
  shadowColorHover: myTokens.color.white,
};

export const allThemes = {
  ...themes,
  nexaBindLight,
  nexaBindDark,
};
