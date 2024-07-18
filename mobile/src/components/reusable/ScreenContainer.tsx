import React from 'react';
import CustomHeader from './CustomHeader';
import { ScrollView } from 'tamagui';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const ScreenContainer = (props: any) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const hVisible = props.hideHeader ? true : false;

  return (
    <View style={styles.screenContainer}>
      {hVisible ? (
        <View style={{ marginTop: 50 }}></View>
      ) : (
        <CustomHeader pageName={props?.pageName} />
      )}
      <ScrollView>{props.children}</ScrollView>
    </View>
  );
};

export default ScreenContainer;

const getStyles = (theme: any) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      flexDirection: 'column',
      padding: 20,
      backgroundColor: theme.bg,
    },
  });
