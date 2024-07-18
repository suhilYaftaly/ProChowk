import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useUpdateJobStatus } from '~/src/graphql/operations/job';
import Toast from 'react-native-toast-message';
import { Button, Spinner } from 'tamagui';
import labels from '~/src/constants/labels';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import FinishBidModal from '../bid/process/FinishBidModal';

type Props = { jobId: string; onSuccess: () => void };

const CompleteJobBtn = ({ jobId, onSuccess }: Props) => {
  const [openFinish, setOpenFinish] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  const { updateJobStatusAsync, loading } = useUpdateJobStatus();

  const onFinishJob = () => {
    updateJobStatusAsync({
      variables: { jobId, status: 'Completed' },
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: labels.jobCompletedMsg,
          position: 'top',
          autoHide: true,
        });

        setOpenFinish(false);
        onSuccess();
      },
    });
  };

  return (
    <>
      <Button
        backgroundColor={loading ? theme.border : theme.primary}
        color={loading ? theme.silver : theme.white}
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
        onAccept={onFinishJob}
        loading={loading}
      />
    </>
  );
};

export default CompleteJobBtn;

const getStyles = (theme: any) =>
  StyleSheet.create({
    bottomBtn: {
      width: '100%',
      fontFamily: 'InterBold',
    },
  });
