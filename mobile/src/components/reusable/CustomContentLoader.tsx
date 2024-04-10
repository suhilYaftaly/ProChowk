import { View } from 'react-native';
import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import colors from '~/src/constants/colors';
import { Spinner } from 'tamagui';

type loaderProps = {
  type: 'list' | 'jobCard';
  size: number;
  repeat: number;
  gap?: number;
};

const CustomContentLoader = ({ type, size, repeat, gap = 0 }: loaderProps) => {
  const height = 6 * size;
  const width = 20 * size;
  const keys = [...Array(repeat).keys()];

  let loader = <Spinner size={'large'} />;
  switch (type) {
    case 'list':
      loader = (
        <ContentLoader
          height={height}
          width={width}
          speed={1}
          backgroundColor={colors.bg}
          foregroundColor={colors.white}
          viewBox="0 0 200 60">
          <Circle cx={30} cy={30} r={20} />
          <Rect x={60} y={15} rx={5} ry={5} width={120} height={10} />
          <Rect x={60} y={30} rx={5} ry={5} width={120} height={10} />
        </ContentLoader>
      );
      break;
    case 'jobCard':
      loader = (
        <ContentLoader
          speed={1}
          height={height}
          width={width}
          viewBox="0 0 200 60"
          backgroundColor={colors.white}
          foregroundColor={colors.bg}>
          <Circle cx={15} cy={15} r={10} />
          <Rect x={27} y={10} rx={3} ry={3} width={88} height={3} />
          <Rect x={27} y={17} rx={3} ry={3} width={52} height={3} />
          <Rect x={5} y={30} rx={3} ry={3} width={170} height={4} />
          <Rect x={5} y={40} rx={3} ry={3} width={190} height={4} />
          <Rect x={5} y={50} rx={3} ry={3} width={150} height={4} />
        </ContentLoader>
      );
      break;
    default:
      loader = <Spinner size={'large'} />;
      break;
  }

  return (
    <View style={{ alignItems: 'center' }}>
      {repeat &&
        repeat > 0 &&
        keys.map((key: number) => {
          return (
            <View key={key} style={{ marginVertical: gap }}>
              {loader}
            </View>
          );
        })}
    </View>
  );
};

export default CustomContentLoader;
