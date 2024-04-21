import { Ionicons } from '@expo/vector-icons';
import React, { ReactElement } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Modal,
  DimensionValue,
} from 'react-native';

import colors from '~/src/constants/colors';

type Props = {
  headerText: string;
  triggerBtnCom?: ReactElement;
  dialogCom: ReactElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  height?: DimensionValue;
  width?: DimensionValue;
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
  itemCount,
}: Props) => {
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
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { minHeight: height, width: width }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.headerText}>
                  {headerText}{' '}
                  {itemCount !== undefined && itemCount > 0 && (
                    <Text style={styles.countText}>({itemCount})</Text>
                  )}
                </Text>
                <Pressable onPress={() => setIsOpen(!isOpen)}>
                  <Ionicons name="close" size={25} color={colors.primary} />
                </Pressable>
              </View>
              <View style={styles.modalBody}>{dialogCom}</View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalCont: {},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  headerText: {
    fontFamily: 'InterExtraBold',
    fontSize: 15,
  },
  modalBody: {
    padding: 15,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary50,
  },
  modalView: {
    backgroundColor: 'white',
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
    color: colors.primary,
  },
});
