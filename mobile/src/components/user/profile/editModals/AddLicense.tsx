import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Image, Spinner, YStack } from 'tamagui';
import InputWithLabel from '~/src/components/reusable/InputWithLabel';
import labels from '~/src/constants/labels';
import {
  IContractor,
  LicenseInput,
  useAddContractorLicense,
} from '~/src/graphql/operations/contractor';
import { getImageFromAlbum } from '~/src/utils/utilFuncs';
import { IImage } from '~/src/types/commonTypes';
import Toast from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
type Props = {
  contractorData?: IContractor;
  closeDialog: () => void;
};

const AddLicense = ({ contractorData, closeDialog }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { addContLicAsync, loading } = useAddContractorLicense();
  const [licenseImage, setLicenseImage] = useState<LicenseInput | undefined>();
  const [licenseName, setLicenseName] = useState('');
  const [licenseNameIsValid, setLicenseNameIsValid] = useState(true);
  const [licenseImageIsValid, setLicenseImageIsValid] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  const handleSaveChanges = () => {
    if (checkLicenseValid()) {
      setDisableSaveBtn(true);

      if (contractorData?.id && licenseImage) {
        addContLicAsync({
          variables: { license: licenseImage, contId: contractorData?.id },
          onSuccess: () => {
            setDisableSaveBtn(false);
            closeDialog();
            Toast.show({
              type: 'success',
              text1: `${labels.licenseAdded}`,
              position: 'top',
            });
          },
          onError: () => {
            setDisableSaveBtn(false);
            Toast.show({
              type: 'error',
              text1: `${labels.licenseFailed}`,
              position: 'top',
            });
          },
        });
      }
    }
  };

  const handleUploadImage = async () => {
    const uploadedImage = await getImageFromAlbum();
    if (uploadedImage && !Array.isArray(uploadedImage) && uploadedImage?.base64) {
      const seleImage: IImage = {
        name: licenseName,
        url: 'data:' + uploadedImage?.mimeType + ';base64,' + uploadedImage?.base64,
        type: uploadedImage?.mimeType ? uploadedImage?.mimeType : 'image/jpeg',
        size: uploadedImage?.fileSize ? uploadedImage?.fileSize : 1000,
      };
      setLicenseImage(seleImage);
    } else if (uploadedImage === null) {
      Toast.show({
        type: 'error',
        text1: `${labels.imageUploadFailed}`,
        position: 'top',
      });
    }
  };

  const checkLicenseValid = () => {
    if (!licenseName && licenseName === '') {
      setLicenseNameIsValid(false);
      return false;
    }
    if (!licenseImage) {
      setLicenseImageIsValid(false);
      return false;
    }
    return true;
  };

  return (
    <View>
      <YStack space={'$4'} marginTop={20}>
        <InputWithLabel
          labelText={labels.licenseName}
          placeholder={labels.licensePlace}
          value={licenseName}
          onChange={(e) => {
            setLicenseName(e);
            setLicenseNameIsValid(true);
          }}
          isError={licenseNameIsValid}
          errorText={labels.licenseError}
        />
        <YStack space={'$1.5'}>
          <Text style={styles.labelText}>
            {labels.media} <Text style={{ color: theme.primary }}>*</Text>
          </Text>
          <Button
            borderWidth={1}
            borderColor={theme.primary}
            borderStyle="dashed"
            onPress={() => handleUploadImage()}
            style={styles.uploadBtn}>
            {labels.upload}
          </Button>
          {licenseImage && (
            <View style={styles.licenseImage}>
              <Pressable
                style={{ position: 'absolute', right: -10, top: -10 }}
                onPress={() => setLicenseImage(undefined)}>
                <AntDesign name="closecircle" size={24} color={theme?.primary} />
              </Pressable>
              <Image
                source={{
                  uri: `${licenseImage?.url}`,
                }}
                style={{ height: 150 }}
                resizeMode="contain"
              />
            </View>
          )}
          {!licenseImageIsValid && (
            <Text style={{ color: theme.error }}>*{labels.licenseImageError}</Text>
          )}
        </YStack>
        <Button
          backgroundColor={disableSaveBtn ? theme.border : theme.primary}
          color={disableSaveBtn ? theme.silver : theme.white}
          style={styles.button}
          onPress={() => handleSaveChanges()}
          disabled={disableSaveBtn}
          icon={loading ? () => <Spinner /> : undefined}>
          {labels?.save}
        </Button>
      </YStack>
    </View>
  );
};

export default AddLicense;

const getStyles = (theme: any) =>
  StyleSheet.create({
    labelText: { fontFamily: 'InterBold', color: theme.textDark },
    uploadBtn: {
      color: theme.primary,
      fontFamily: 'InterBold',
      backgroundColor: theme.white,
      marginBottom: 15,
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
    licenseImage: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 7,
      margin: 10,
    },
  });
