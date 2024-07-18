import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useCompleteBid } from '~/src/graphql/operations/jobBid';
import Toast from 'react-native-toast-message';
import { Button, Spinner } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';
import FinishBidModal from './FinishBidModal';

type Props = { bidId: string; onSuccess: () => void };
const CompleteBidBtn = ({ bidId, onSuccess }: Props) => {
  const [openFinish, setOpenFinish] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { completeBidAsync, loading } = useCompleteBid();

  const onCompleteBid = () => {
    completeBidAsync({
      variables: { bidId },
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: labels.bidCompletedMsg,
          position: 'top',
        });
        setOpenFinish(false);
        onSuccess();
      },
    });
  };

  return (
    <View>
      <Button
        backgroundColor={loading ? theme.border : theme.primary}
        color={loading ? theme.silver : '#fff'}
        style={[styles.bottomBtn, { bottom: bottom }]}
        icon={loading ? () => <Spinner /> : undefined}
        borderRadius={0}
        onPress={() => setOpenFinish(true)}
        disabled={loading}>
        {labels.finishThisJob}
      </Button>
      <FinishBidModal
        open={openFinish}
        onClose={setOpenFinish}
        onAccept={onCompleteBid}
        loading={loading}
      />
    </View>
  );
};

export default CompleteBidBtn;
const getStyles = (theme: any) =>
  StyleSheet.create({
    bottomBtn: {
      width: '100%',
      fontFamily: 'InterBold',
    },
  });
