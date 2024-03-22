import React, { CSSProperties } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import Svg, { Ellipse, G, Path, Defs, ClipPath, Circle, Rect } from 'react-native-svg';
import colors from '~/src/constants/colors';
import labels from '~/src/constants/labels';

export interface IconInterface {
  color?: string;
  width?: number;
  height?: number;
  size?: number;
  opacity?: number;
  style?: CSSProperties;
  name: 'emailVerify';
}

//https://transform.tools/svg-to-react-native
export default function CustomIcons(
  { color, width, height, size, opacity, name, style }: IconInterface,
  props: any
) {
  const iconColor = color ? color : colors.black;
  const iconWidth = width ? width : style?.width ? style?.width : size ? size : 50;
  const iconHeight = height ? height : style?.height ? style?.height : size ? size : 50;
  const iconOpacity = opacity ? opacity : 0.6;

  switch (name) {
    case 'emailVerify':
      return (
        <Svg
          width={iconWidth}
          height={iconHeight}
          viewBox="0 0 62 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}>
          <Path
            d="M53.875 9.531H8.125a5.72 5.72 0 0 0-5.719 5.719v30.5a5.72 5.72 0 0 0 5.719 5.719h45.75a5.72 5.72 0 0 0 5.719-5.719v-30.5a5.72 5.72 0 0 0-5.719-5.719"
            fill="#FFA000"
          />
          <Path
            d="M53.875 9.531H8.125a5.72 5.72 0 0 0-5.204 3.355L29.608 31.95a2.5 2.5 0 0 0 1.392.457c.507 0 1-.16 1.41-.457l26.688-19.063a5.72 5.72 0 0 0-5.223-3.355"
            fill="#FFD54F"
          />
        </Svg>
      );

    default:
      return <Text>{labels.iconNotFound}</Text>;
  }
}
