import { Link, router } from 'expo-router';
import React from 'react';
import { View, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Button, XStack, YStack } from 'tamagui';
import { Text } from 'tamagui';
import Routes from '../routes/Routes';
import labels from '../constants/labels';

const Home = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('~/assets/launch.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.welcomeContainer}></View>
        <View style={styles.homeCont}>
          <YStack alignItems="center" jc={'center'} flex={1}>
            <Text fontSize={'$8'} fontWeight={'700'} color={'white'}>
              {labels.welcomeTo}
            </Text>
            <XStack alignItems="center">
              <Text fontWeight={'700'} fontSize={'$12'} color="$primary">
                {labels.nexa}
              </Text>
              <Text fontWeight={'700'} fontSize={'$12'} color={'white'}>
                {labels.bind}
              </Text>
            </XStack>
            <Text
              fontWeight={'$5'}
              fontSize={'$5'}
              color={'white'}
              paddingHorizontal={'$3.5'}
              paddingVertical={'$2'}
              textAlign="center"
              lineHeight={'$5'}>
              {labels.welcomeScreenSubText}
            </Text>
          </YStack>
          <YStack alignItems="center" jc={'center'} flex={1}>
            <Link href={`/${Routes.signup}`} asChild>
              <Button
                style={styles.button}
                backgroundColor={'$primary'}
                borderBottomLeftRadius={50}>
                {labels.signUp}
              </Button>
            </Link>
            <Button
              style={styles.button}
              variant="outlined"
              borderWidth={1}
              borderColor={'$white'}
              onPress={() => router.navigate(`/${Routes.login}`)}>
              {labels.logIn}
            </Button>
            <Pressable
              style={styles.skipLink}
              onPress={() => router.replace(`/${Routes.dashboard}`)}>
              <Text color={'white'}>{labels.skipButton}</Text>
            </Pressable>
          </YStack>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  welcomeContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#023047',
    opacity: 0.8,
  },
  homeCont: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    fontFamily: 'InterSemiBold',
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  skipLink: {
    width: '80%',
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
