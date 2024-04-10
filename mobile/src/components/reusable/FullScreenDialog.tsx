import React, { ReactElement } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  triggerBtnCom?: ReactElement;
  dialogCom: ReactElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FullScreenDialog = ({ triggerBtnCom, dialogCom, isOpen, setIsOpen }: Props) => {
  const { top } = useSafeAreaInsets();
  const os = Platform?.OS;
  return (
    <View>
      <Pressable onPress={() => setIsOpen(!isOpen)}>{triggerBtnCom}</Pressable>
      <Modal
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => {
          setIsOpen(!isOpen);
        }}>
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          <View style={os === 'ios' ? { paddingTop: top - 20 } : {}}>
            <View style={[styles.modalView]}>{dialogCom}</View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default FullScreenDialog;

const styles = StyleSheet.create({
  modalView: {
    gap: 10,
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
});
