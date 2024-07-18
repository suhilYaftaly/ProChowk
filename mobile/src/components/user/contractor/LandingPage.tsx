import { ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import { Image, YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import SearchContractor from './SearchContractor';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const LandingPage = (props: any) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { height, width } = useWindowDimensions();
  return (
    <View>
      <Image
        source={require('~/assets/HomePage.jpeg')}
        resizeMode="cover"
        height={height * 0.35}
        width={width}
      />
      <View style={styles.welcomeContainer}></View>
      <View style={styles.homeCont}>
        <SearchContractor {...props} />
        <Text style={styles.welcomeText}>{labels.welcomeScreenMessage}</Text>
        <Text style={styles.welcomeSubText}>{labels.landingScreenMessage}</Text>
      </View>
    </View>
  );
};

export default LandingPage;

const getStyles = (theme: any) =>
  StyleSheet.create({
    welcomeContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: '#023047',
      opacity: 0.6,
    },
    homeCont: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      paddingHorizontal: 20,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    welcomeText: {
      fontFamily: 'InterBold',
      fontSize: 20,
      color: '#fff',
      textAlign: 'center',
      marginTop: 40,
    },
    welcomeSubText: {
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      color: '#fff',
      textAlign: 'center',
      marginTop: 10,
    },
  });
