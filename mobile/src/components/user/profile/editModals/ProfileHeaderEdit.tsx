import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { IUser, useUpdateUser } from '~/src/graphql/operations/user';
import { Avatar, Button, Spinner, YStack } from 'tamagui';
import { getImageFromAlbum } from '~/src/utils/utilFuncs';
import { IImage } from '~/src/types/commonTypes';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';
import InputWithLabel from '~/src/components/reusable/InputWithLabel';
import AddressSearch from '../../signUp/AddressSearch';
import { AddressInput, IAddress } from '~/src/graphql/operations/address';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
type Props = {
  userData?: IUser;
  closeDialog: () => void;
};
const ProfileHeaderEdit = ({ userData, closeDialog }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { updateUserAsync, loading: updLoading } = useUpdateUser();
  const [userImage, setUserImage] = useState<IImage | undefined>(userData?.image);
  const [name, setName] = useState<string>(userData?.name ? userData?.name : '');
  const [location, setLocation] = useState<AddressInput>();
  const [isNameValid, setIsNameValid] = useState(true);
  const [locationAvail, setLocationAvail] = useState<boolean>(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  const handleUploadImage = async () => {
    const uploadedImage = await getImageFromAlbum();
    if (uploadedImage && !Array.isArray(uploadedImage) && uploadedImage?.base64) {
      const seleImage: IImage = {
        name: userData?.name + '.jpg',
        url: 'data:' + uploadedImage?.mimeType + ';base64,' + uploadedImage?.base64,
        type: uploadedImage?.mimeType ? uploadedImage?.mimeType : 'image/jpeg',
        size: uploadedImage?.fileSize ? uploadedImage?.fileSize : 1000,
      };
      setUserImage(seleImage);
    } else if (uploadedImage === null) {
      Toast.show({
        type: 'error',
        text1: `${labels.imageUploadFailed}`,
        position: 'top',
      });
    }
  };
  const handleSaveChanges = () => {
    if (checkFormValidation()) {
      setDisableSaveBtn(true);
      if (userData && userImage) {
        const refinedUserImage = getUserImage(userImage);
        if (refinedUserImage) {
          const updateData = {
            id: userData.id,
            edits: { name: name, address: location, image: refinedUserImage },
          };
          updateUserAsync({
            variables: updateData,
            onSuccess: () => {
              setDisableSaveBtn(false);
              closeDialog();
              Toast.show({
                type: 'success',
                text1: `${labels.profileUpdated}`,
                position: 'top',
              });
            },
            onError: () => {
              setDisableSaveBtn(false);
              Toast.show({
                type: 'error',
                text1: `${labels.profileUpdateFailed}`,
                position: 'top',
              });
            },
          });
        }
      }
    }
  };

  const checkFormValidation = () => {
    if (!name || name === '') {
      setIsNameValid(false);
      return false;
    }
    if (!location?.lat || !location?.lng) {
      setLocationAvail(false);
      return false;
    }
    return true;
  };

  const getUserImage = (userImage: IImage) => {
    if (userData && userImage) {
      return {
        name: userData?.name + '.jpg',
        url: userImage?.url,
        type: userImage?.type,
        size: userImage?.size,
      };
    }
  };

  return (
    <View>
      <View style={styles.profileImageCont}>
        <Avatar circular size="$6">
          {userImage ? (
            <Avatar.Image accessibilityLabel={userImage?.name} src={userImage?.url} />
          ) : (
            <Avatar.Image
              accessibilityLabel="default"
              src={require('@assets/images/userDummy.png')}
            />
          )}
        </Avatar>
        <Button
          style={styles.uploadBtn}
          borderWidth={1}
          borderColor={theme.primary}
          onPress={() => handleUploadImage()}>
          {labels.updateProfileImage}
        </Button>
      </View>
      <YStack space={'$4'} marginTop={20}>
        <InputWithLabel
          labelText={labels.name}
          placeholder={labels.placeName}
          value={name}
          onChange={(e) => {
            setName(e);
            setIsNameValid(true);
          }}
          isError={isNameValid}
          errorText={labels.nameError}
        />
        {userData?.email && (
          <InputWithLabel
            labelText={labels.email}
            placeholder={labels.placeEmail}
            value={userData?.email}
            onChange={() => {}}
            isError={true}
            isDisabled={true}
          />
        )}
        <AddressSearch
          location={location}
          setLocation={(loc: IAddress) => {
            setLocation(loc);
            setLocationAvail(true);
          }}
          isError={locationAvail}
          errorText={labels.addressError}
        />
      </YStack>
      <Button
        backgroundColor={disableSaveBtn ? theme.border : theme.primary}
        color={disableSaveBtn ? theme.silver : theme.white}
        style={styles.button}
        onPress={() => handleSaveChanges()}
        disabled={disableSaveBtn}
        icon={updLoading ? () => <Spinner /> : undefined}>
        {labels?.save}
      </Button>
    </View>
  );
};

export default ProfileHeaderEdit;

const getStyles = (theme: any) =>
  StyleSheet.create({
    profileImageCont: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 10,
    },
    uploadBtn: {
      backgroundColor: theme.white,
      color: theme.primary,
      fontFamily: 'InterBold',
      fontSize: 15,
      borderWidth: 1,
      borderColor: theme.primary,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginLeft: 15,
    },
    button: {
      fontFamily: 'InterBold',
      fontSize: 15,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginTop: 30,
      marginBottom: 10,
      justifyContent: 'center',
      color: '#fff',
    },
  });
