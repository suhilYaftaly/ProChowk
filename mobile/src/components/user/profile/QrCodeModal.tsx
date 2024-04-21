import { Platform, Share, StyleSheet, Text, View } from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import CustomModal from '../../reusable/CustomModal';
import QRCode from 'react-native-qrcode-svg';
import { Button, Spinner } from 'tamagui';
import { Feather, Octicons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';

type Props = {
  userName?: string;
  qrcodeUri: string;
  triggerButton: ReactElement;
};

const QrCodeModal = ({ userName, qrcodeUri, triggerButton }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrSvgRef, setQrSvgRef] = useState<any>();
  const [imageLoading, setImageLoding] = useState(false);
  const [showMediaPerError, setShowMediaPerError] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');

  const generateQRImage = async (actionType: string) => {
    setImageLoding(true);
    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem?.StorageAccessFramework?.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        setImageLoding(false);
        setShowMediaPerError(true);
        return;
      }
    }
    if (qrSvgRef) {
      qrSvgRef?.toDataURL((data: any) => {
        let filePath = FileSystem?.cacheDirectory + `/${userName}.png`;
        FileSystem.writeAsStringAsync(filePath, data, {
          encoding: FileSystem.EncodingType.Base64,
        })
          .then(() => {
            if (actionType === 'share') {
              handleShare(filePath);
            } else if (actionType === 'save') {
              saveImageToLibrary(filePath);
            }
            setImageLoding(false);
          })
          .catch(() => {
            setImageLoding(false);
            Toast.show({
              type: 'error',
              text1: `${labels.qrGenerateFailed}`,
              position: 'top',
            });
          });
      });
    }
  };

  const saveImageToLibrary = async (qrImagePath: string) => {
    if (qrImagePath && qrImagePath !== '') {
      const mediaPer = await MediaLibrary?.requestPermissionsAsync();
      if (mediaPer?.status === 'granted') {
        MediaLibrary?.saveToLibraryAsync(qrImagePath)?.then((onSuccess) => {
          setIsOpen(false);
          Toast.show({
            type: 'success',
            text1: `${labels.qrSaveImageSuccess}`,
            position: 'top',
          });
        });
      } else {
        setShowMediaPerError(true);
      }
    }
  };

  const handleShare = async (qrImagePath: string) => {
    try {
      if (qrImagePath && qrImagePath !== '') {
        const result = await Share.share({
          message: `${labels.quickLinkMessage}`,
          title: `${labels.shareQR}`,
          url: qrImagePath,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: `${error.message}`,
        position: 'top',
      });
    }
  };

  const deleteCachedImage = async () => {
    if (imagePath && imagePath !== '') {
      await FileSystem.deleteAsync(imagePath, { idempotent: true });
      setImagePath('');
    }
  };

  useEffect(() => {
    if (!isOpen && imagePath && imagePath !== '') {
      deleteCachedImage();
    }
  }, [isOpen]);

  return (
    <CustomModal
      headerText={labels.profileQrCode}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width={'90%'}
      triggerBtnCom={triggerButton}
      dialogCom={
        <View style={styles.container}>
          <QRCode
            size={150}
            value={qrcodeUri}
            logo={require('@assets/images/logoWhiteOutline.png')}
            logoSize={30}
            logoBackgroundColor="transparent"
            getRef={(c) => setQrSvgRef(c)}
          />
          <Text style={styles.boldText}>{labels.scanQRCode}</Text>
          <Text style={styles.normalText}>{labels.printQRCode}</Text>
          <Button
            style={styles.shareBtn}
            onPress={() => {
              generateQRImage('share');
            }}
            backgroundColor={imageLoading ? colors.bg : colors.primary}
            disabled={imageLoading}
            icon={
              imageLoading ? (
                <Spinner />
              ) : (
                <Octicons name="share-android" size={20} color={colors.white} />
              )
            }>
            {labels.shareQR}
          </Button>
          <Button
            onPress={() => generateQRImage('save')}
            style={styles.downLoadButton}
            disabled={imageLoading}
            backgroundColor={colors.white}
            color={imageLoading ? colors.bg : colors.textDark}
            icon={
              imageLoading ? (
                <Spinner />
              ) : (
                <Feather name="download" size={24} color={colors.textDark} />
              )
            }>
            {labels.saveQR}
          </Button>
          {showMediaPerError && (
            <Text style={{ color: colors.error }}>{labels.fileAccessDenied}</Text>
          )}
        </View>
      }
    />
  );
};

export default QrCodeModal;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  boldText: {
    fontFamily: 'InterExtraBold',
    fontSize: 15,
    color: colors.textDark,
    marginVertical: 20,
  },
  normalText: {
    fontFamily: 'InterMedium',
    fontSize: 15,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  shareBtn: {
    color: colors.white,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    width: '90%',
    marginBottom: 15,
    fontFamily: 'InterExtraBold',
    fontSize: 15,
  },
  downLoadButton: {
    fontFamily: 'InterExtraBold',
    fontSize: 15,
  },
});
