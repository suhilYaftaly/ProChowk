import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  Button,
  Card,
  H2,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Spinner,
  YStack,
} from 'tamagui';
import colors from '~/src/constants/colors';
import { Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import {
  getUserLocationPermissions,
  removeServerMetadata,
  removeTypename,
} from '~/src/utils/utilFuncs';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { userLocationSuccess } from '~/src/redux/slices/userSlice';
import {
  IAddress,
  IGeoAddress,
  useGeocode,
  useReverseGeocode,
} from '~/src/graphql/operations/address';

import FullScreenDialog from '../reusable/FullScreenDialog';
import { useUserStates } from '~/src/redux/reduxStates';
import labels from '~/src/constants/labels';

type Props = {
  location: IAddress | undefined;
  setLocation: (loc: IAddress) => void;
  isError: boolean;
  errorText: string;
};

const AddressSearch = ({ location, setLocation, isError, errorText }: Props) => {
  const dispatch = useAppDispatch();
  const { userLocation } = useUserStates();
  const { geocodeAsync, data, loading } = useGeocode();
  const { reverseGeocodeAsync, loading: rGeoLoading } = useReverseGeocode();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const lat = userLocation?.data?.lat;
  const lng = userLocation?.data?.lng;

  const onInputChange = (val: string) => {
    if (val?.trim().length > 2 && val.length > displayValue?.length) {
      geocodeAsync({ vars: { value: val, lat, lng } });
    }
    setInputValue(val);
    setDisplayValue(val);
  };

  const getCurrentLocation = () => {
    getUserLocationPermissions({
      onSuccess: ({ lat, lng }) => {
        dispatch(userLocationSuccess({ lat, lng }));
        reverseGeocodeAsync({
          variables: { lat, lng },
          onSuccess: (data) => {
            const cleanedAdr = removeServerMetadata(data);
            setLocation(getAddressFormat(cleanedAdr));
          },
        });
      },
    });
  };

  return (
    <YStack space={'$1.5'}>
      <Text style={styles.labelText}>
        {labels.location}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <FullScreenDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerBtnCom={
          <Button
            unstyled
            style={styles.menuButton}
            borderColor={'$border'}
            borderWidth={1}
            borderRadius={7}
            backgroundColor={'$white'}
            iconAfter={
              <Pressable
                style={{ paddingVertical: 5, paddingHorizontal: 10 }}
                onPress={() => getCurrentLocation()}>
                <MaterialIcons name="my-location" size={20} color="black" />
              </Pressable>
            }
            onPress={() => setIsOpen(true)}>
            {location?.displayName ? location?.displayName : labels.location}
          </Button>
        }
        dialogCom={
          <>
            <View style={styles.searchContainer}>
              <Pressable onPress={() => setIsOpen(false)} style={styles.addBtn}>
                <FontAwesome6 name="angle-left" size={20} color="black" />
              </Pressable>
              <Input
                size={'$3'}
                flex={1}
                borderWidth={0}
                style={styles.inputText}
                placeholder={labels.searchAddress}
                autoCorrect={false}
                value={inputValue}
                onChangeText={(e) => onInputChange(e)}
              />
            </View>
            <Separator />
            {loading ? (
              <Spinner size="large" color="$primary" />
            ) : data?.geocode && data?.geocode?.length > 0 ? (
              <ScrollView padding={0} style={styles.skillsCont}>
                {data?.geocode?.map((address: IAddress, index: number) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setLocation(getAddressFormat(address));
                        setIsOpen(false);
                      }}>
                      <View style={styles.itemCont}>
                        <Text>{address?.displayName}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <Card size="$4" width={300} height={300} alignSelf="center">
                <Card.Background justifyContent="center" alignItems="center">
                  <Entypo name="emoji-sad" size={100} color={colors.textBlue} />
                  <H2 textAlign="center">{labels.noSkillsMsg}</H2>
                  <Paragraph>{labels.searchForSkillsMsg}</Paragraph>
                </Card.Background>
              </Card>
            )}
          </>
        }
      />
      {!isError && <Text style={{ color: 'red' }}>*{errorText}</Text>}
    </YStack>
  );
};

export default AddressSearch;

const styles = StyleSheet.create({
  labelText: { fontFamily: 'InterBold' },
  menuButton: {
    justifyContent: 'space-between',
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    marginTop: 30,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  itemCont: {
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  skillsCont: {
    flex: 1,
    marginTop: 10,
  },
});

export const getAddressFormat = (adr: IAddress) => {
  return {
    displayName: adr.displayName,
    street: adr.street,
    city: adr.city,
    county: adr.county,
    state: adr.state,
    stateCode: adr.stateCode,
    postalCode: adr.postalCode,
    country: adr.country,
    countryCode: adr.countryCode,
    lat: adr.lat,
    lng: adr.lng,
    geometry: removeTypename(adr.geometry),
  } as IGeoAddress;
};
