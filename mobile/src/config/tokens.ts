import { createTokens } from 'tamagui';
import { tokens } from '@tamagui/themes';

const myTokens = createTokens({
  size: tokens.size,
  color: {
    ...tokens.color,
    ...{
      primary: '#FF5E15',
      bg: '#EAF1FB',
      secondary: '#275775',
      silver: '#716A85',
      error: '#FF5050',
      info: '#3498db',
      warning: '#f1c40f',
      success: '#00BD40',
      white: '#fff',
      black: '#121212',
      textBlue: '#3B3356',
      textDark: '#023047',
      border: '#DBDBDB',
    },
  },
  radius: tokens.radius,
  space: tokens.space,
  zIndex: tokens.zIndex,
});
export default myTokens;
