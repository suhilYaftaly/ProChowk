import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import React, { ReactElement, useState } from 'react';
import CustomModal from '../../reusable/CustomModal';
import QRCode from 'react-native-qrcode-svg';
import CustomIcons from '../../reusable/CustomIcons';
import { Button } from 'tamagui';
import { Feather, Octicons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';

type Props = {
  qrcodeUri: string;
  triggerButton: ReactElement;
};

const QrCodeModal = ({ qrcodeUri, triggerButton }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Quick Link to the Contractor Profile',
        title: 'Share QR Code',
        url: qrcodeUri,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {}
  };

  const handleSave = async () => {};

  return (
    <CustomModal
      headerText="Profile QR Code"
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
          />
          <Text style={styles.boldText}>Scan this QR code</Text>
          <Text style={styles.normalText}>
            Print and stick it in your truck, sign boards, shop window and etc.
          </Text>
          <Button
            style={styles.shareBtn}
            onPress={() => handleShare()}
            icon={<Octicons name="share-android" size={20} color={colors.white} />}>
            Share With Others
          </Button>
          <Pressable>
            <Button
              style={styles.downLoadButton}
              icon={<Feather name="download" size={24} color={colors.textDark} />}>
              Save as Image
            </Button>
          </Pressable>
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
    backgroundColor: colors.primary,
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
    color: colors.textDark,
    backgroundColor: 'transparent',
    fontFamily: 'InterExtraBold',
    fontSize: 15,
  },
});
