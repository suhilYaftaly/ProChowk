import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { IContractor } from '~/src/graphql/operations/contractor';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import {
  PortfolioImage,
  useAddContractorPortfolio,
} from '~/src/graphql/operations/contractorPortfolio';
import labels from '~/src/constants/labels';
import Toast from 'react-native-toast-message';
import { IImage } from '~/src/types/commonTypes';
import { getImageFromAlbum } from '~/src/utils/utilFuncs';
import { Button, Image, Spinner, TextArea, YStack } from 'tamagui';
import InputWithLabel from '~/src/components/reusable/InputWithLabel';
import { AntDesign } from '@expo/vector-icons';
type Props = {
  contractorData?: IContractor;
  closeDialog: () => void;
};
const AddPortfolio = ({ contractorData, closeDialog }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { addContractorPortfolioAsync, loading } = useAddContractorPortfolio();
  const [portfolioImage, setPortfolioImage] = useState<PortfolioImage>();
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioNameIsValid, setPortfolioNameIsValid] = useState(true);
  const [portfolioImageIsValid, setPortfolioImageIsValid] = useState(true);
  const [portfolioDescIsValid, setPortfolioDescIsValid] = useState(true);

  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  const handleSaveChanges = () => {
    if (checkPortfolioValid()) {
      setDisableSaveBtn(true);

      if (contractorData?.id && portfolioImage) {
        addContractorPortfolioAsync({
          variables: {
            images: [portfolioImage],
            contractorId: contractorData?.id,
            title: portfolioName,
            description: portfolioDesc,
          },
          onSuccess: () => {
            setDisableSaveBtn(false);
            closeDialog();
            Toast.show({
              type: 'success',
              text1: `${labels.portfolioAdded}`,
              position: 'top',
            });
          },
          onError: () => {
            setDisableSaveBtn(false);
            Toast.show({
              type: 'error',
              text1: `${labels.portfolioFailed}`,
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
        name: portfolioName,
        url: 'data:' + uploadedImage?.mimeType + ';base64,' + uploadedImage?.base64,
        type: uploadedImage?.mimeType ? uploadedImage?.mimeType : 'image/jpeg',
        size: uploadedImage?.fileSize ? uploadedImage?.fileSize : 1000,
      };
      setPortfolioImage(seleImage);
    } else if (uploadedImage === null) {
      Toast.show({
        type: 'error',
        text1: `${labels.imageUploadFailed}`,
        position: 'top',
      });
    }
  };

  const checkPortfolioValid = () => {
    if (!portfolioName && portfolioName === '') {
      setPortfolioNameIsValid(false);
      return false;
    }
    if (!portfolioDesc && portfolioDesc === '') {
      setPortfolioDescIsValid(false);
      return false;
    }
    if (!portfolioImage) {
      setPortfolioImageIsValid(false);
      return false;
    }
    return true;
  };

  return (
    <View>
      <YStack space={'$4'} marginTop={20}>
        <InputWithLabel
          labelText={labels.title}
          placeholder={labels.titlePlace}
          value={portfolioName}
          onChange={(e) => {
            setPortfolioName(e);
            setPortfolioNameIsValid(true);
          }}
          isError={portfolioNameIsValid}
          errorText={labels.portfolioNameError}
        />
        <YStack space={'$1.5'}>
          <Text style={styles.labelText}>
            {labels.description} <Text style={{ color: theme.primary }}>*</Text>
          </Text>
          <TextArea
            placeholder={labels.tellUsAboutPortfolio}
            size="$3"
            borderWidth={1}
            borderColor={theme.border}
            style={[styles.inputText, { textAlignVertical: 'top' }]}
            value={portfolioDesc}
            maxLength={1000}
            onChangeText={(e) => setPortfolioDesc(e)}
          />
          {!portfolioDescIsValid && (
            <Text style={{ color: theme.error }}>*{labels.profileDescError}</Text>
          )}
        </YStack>
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
          {portfolioImage && (
            <View style={styles.portfolioImage}>
              <Pressable
                style={{ position: 'absolute', right: -10, top: -10 }}
                onPress={() => setPortfolioImage(undefined)}>
                <AntDesign name="closecircle" size={24} color={theme?.primary} />
              </Pressable>
              <Image
                source={{
                  uri: `${portfolioImage?.url}`,
                }}
                style={{ height: 150 }}
                resizeMode="contain"
              />
            </View>
          )}
          {!portfolioImageIsValid && (
            <Text style={{ color: theme.error }}>*{labels.portfolioImageError}</Text>
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

export default AddPortfolio;

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
    portfolioImage: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 7,
      margin: 10,
    },
    inputText: {
      color: theme.black,
      backgroundColor: 'transparent',
    },
  });
