const commonColors = {
  error: '#FF5050',
  info: '#25B3EC',
  warning: '#f1c40f',
  success: '#00BD40',
  primary: '#FF5E15',
  primary20: '#FF5E1533',
  primaryDark: '#0A1929',
  secondary: '#275775',
  secondaryDark: '#023047',
  secondary50: '#27577580',
};

const lightTheme = {
  ...commonColors,
  ...{
    bg: '#EAF1FB',
    silver: '#716A85',
    white: '#fff',
    black: '#121212',
    textBlue: '#3B3356',
    textDark: '#023047',
    border: '#DBD9E0',
  },
};

const darkTheme = {
  ...commonColors,
  ...{
    bg: '#275775',
    silver: '#EAF1FB',
    white: '#0A1929',
    black: '#fff',
    textBlue: '#fff',
    textDark: '#fff',
    border: '#DBD9E0',
  },
};

export { lightTheme, darkTheme };
/* 
export default {
  primary: '#FF5E15',
  primary20: '#FF5E1533',
  bg: '#EAF1FB',
  secondary: '#275775',
  secondary50: '#27577580',
  silver: '#716A85',
  error: '#FF5050',
  info: '#25B3EC',
  warning: '#f1c40f',
  success: '#00BD40',
  white: '#fff',
  black: '#121212',
  textBlue: '#3B3356',
  textDark: '#023047',
  border: '#DBD9E0',
};
 */
