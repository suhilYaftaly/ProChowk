import { Pressable, StyleSheet, Text, View, Linking } from 'react-native';
import React, { useState } from 'react';
import { Circle, Dialog, Button, ScrollView, Spinner } from 'tamagui';
import { FontAwesome6 } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
import labels from '~/src/constants/labels';
import * as Location from 'expo-location';
import { userLocationSuccess } from '~/src/redux/slices/userSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  locPermission: Location.PermissionStatus | undefined;
  setLocPermission: (status: Location.PermissionStatus | undefined) => void;
};

const LocationPermission = ({ isOpen, setIsOpen, locPermission, setLocPermission }: Props) => {
  const dispatch = useAppDispatch();
  const [processLoading, setProcessLoading] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const enableLocation = async () => {
    if (locPermission && locPermission !== 'granted') {
      let { canAskAgain } = await Location.getForegroundPermissionsAsync();
      if (canAskAgain) {
        setProcessLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let currentLocation = await Location.getCurrentPositionAsync({});
          const { latitude: lat, longitude: lng } = currentLocation?.coords;
          dispatch(userLocationSuccess({ lat, lng }));
        }
        setLocPermission(status);
      } else {
        Linking.openSettings();
      }
    }
    setProcessLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Content
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          paddingHorizontal={20}
          minHeight={readMore ? '90%' : '45%'}
          width={'85%'}
          backgroundColor={'$white'}
          paddingVertical={30}>
          <View style={styles.locationCont}>
            <Circle backgroundColor={colors.primary} size={50}>
              <FontAwesome6 name="location-dot" size={26} color={colors.white} />
            </Circle>
            <Text style={styles.headerText}>{labels.locationRequired}</Text>
            <ScrollView maxHeight={'75%'}>
              <Text style={styles.normalText}>{labels.enhanceText}</Text>
              {readMore && (
                <>
                  <Text style={styles.subHeaderText}>{labels.whycollectText} </Text>

                  <Text style={styles.normalText}>{labels.trilorText}</Text>
                  <Text style={styles.normalText}>{labels.provideText}</Text>
                  <Text style={styles.normalText}>{labels.improveText}</Text>

                  <Text style={styles.subHeaderText}>{labels.privercyText}</Text>
                  <Text style={styles.normalText}>{labels.locationDataText}</Text>
                </>
              )}
              <Pressable style={styles.readLink} onPress={() => setReadMore(!readMore)}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    color: colors.primary,
                    fontFamily: 'InterSemiBold',
                  }}>
                  {readMore ? labels.readLess : labels.readMore}
                </Text>
              </Pressable>
            </ScrollView>
            <Button
              style={styles.button}
              backgroundColor={processLoading ? colors.border : colors.primary}
              onPress={() => enableLocation()}
              icon={processLoading ? <Spinner /> : undefined}
              disabled={processLoading}>
              {labels.enableLocation}
            </Button>
            <Pressable
              style={styles.skipLink}
              disabled={processLoading}
              onPress={() => setIsOpen(false)}>
              <Text style={styles.normalText}>{labels.skipButton}</Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default LocationPermission;

const styles = StyleSheet.create({
  locationCont: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 10,
    marginTop: 10,
  },
  subHeaderText: {
    fontSize: 15,
    fontFamily: 'InterExtraBold',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 15,
  },
  normalText: {
    fontSize: 15,
    fontFamily: 'InterMedium',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 25,
  },
  button: {
    fontFamily: 'InterBold',
    fontSize: 15,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    color: colors.white,
    width: '90%',
  },
  skipLink: {
    margin: 5,
  },
  readLink: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    margin: 10,
  },
});
