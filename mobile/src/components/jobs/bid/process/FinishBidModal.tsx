import { Modal, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { Button, Spinner } from 'tamagui';
import labels from '~/src/constants/labels';

type Props = {
  open: boolean;
  onClose: (close: boolean) => void;
  onAccept: () => void;
  loading: boolean;
};

const FinishBidModal = ({ open, onClose, onAccept, loading }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <Modal
      animationType="fade"
      visible={open}
      onRequestClose={() => {
        onClose(!open);
      }}
      transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={{
              color: theme.textDark,
              fontFamily: 'InterBold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            {labels.finishBidTxt}
          </Text>
          <Text
            style={{
              color: theme.textDark,
              fontFamily: 'InterSemiBold',
              fontSize: 15,
              textAlign: 'center',
            }}>
            {labels.bidMarkedComplete}
          </Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Button
                style={[styles.footerBtn, { backgroundColor: theme.success, color: theme.white }]}
                icon={loading ? <Spinner /> : undefined}
                disabled={loading}
                onPress={onAccept}
                unstyled>
                {labels.yes}
              </Button>
              <Button
                style={[styles.footerBtn, { backgroundColor: theme.primary, color: theme.white }]}
                onPress={() => onClose(!open)}
                unstyled>
                {labels.no}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FinishBidModal;

const getStyles = (theme: any) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary50,
    },
    modalView: {
      width: '80%',
      padding: 20,
      alignItems: 'center',
      backgroundColor: theme.white,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      rowGap: 10,
    },
    footerBtn: {
      fontSize: 15,
      fontFamily: 'InterBold',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 50,
      width: '45%',
    },
  });
