import { StyleSheet, Text, View } from 'react-native';
import React, { ReactElement } from 'react';
import { Button, Dialog } from 'tamagui';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  triggerBtnCom?: ReactElement;
  dialogCom: ReactElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const FullScreenDialog = ({ triggerBtnCom, dialogCom, isOpen, setIsOpen }: Props) => {
  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{triggerBtnCom}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          height={'100%'}
          width={'100%'}
          padding={20}
          backgroundColor={'$white'}>
          {dialogCom}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default FullScreenDialog;

const styles = StyleSheet.create({});
