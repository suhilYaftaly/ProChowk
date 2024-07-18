import { Ionicons } from '@expo/vector-icons';
import React, { ReactElement } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
  DimensionValue,
  Keyboard,
} from 'react-native';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  headerText: string;
  triggerBtnCom?: ReactElement;
  dialogCom: ReactElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  height?: DimensionValue;
  width?: DimensionValue;
  maxHeight?: DimensionValue;
  itemCount?: number;
};

const CustomModal = ({
  headerText,
  triggerBtnCom,
  dialogCom,
  isOpen,
  setIsOpen,
  height = '30%',
  width = '50%',
  maxHeight = '100%',
  itemCount,
}: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <View>
      <Pressable onPress={() => setIsOpen(!isOpen)}>{triggerBtnCom}</Pressable>
      <Modal
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => {
          setIsOpen(!isOpen);
        }}
        transparent={true}>
        {/*  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                { minHeight: height, maxHeight: maxHeight, width: width, overflow: 'hidden' },
              ]}>
              <View style={styles.modalHeader}>
                <Text style={styles.headerText}>
                  {headerText}{' '}
                  {itemCount !== undefined && itemCount > 0 && (
                    <Text style={styles.countText}>({itemCount})</Text>
                  )}
                </Text>
                <Pressable onPress={() => setIsOpen(!isOpen)}>
                  <Ionicons name="close" size={25} color={theme.primary} />
                </Pressable>
              </View>
              <View style={styles.modalBody}>{dialogCom}</View>
            </View>
          </View>
        </KeyboardAvoidingView>
        {/*   </TouchableWithoutFeedback> */}
      </Modal>
    </View>
  );
};

export default CustomModal;

const getStyles = (theme: any) =>
  StyleSheet.create({
    modalCont: {},
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
    },
    headerText: {
      fontFamily: 'InterExtraBold',
      fontSize: 15,
      color: theme.textDark,
    },
    modalBody: {
      padding: 15,
    },
    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary50,
    },
    modalView: {
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
    },
    countText: {
      fontFamily: 'InterExtraBold',
      fontSize: 15,
      color: theme.primary,
    },
  });
