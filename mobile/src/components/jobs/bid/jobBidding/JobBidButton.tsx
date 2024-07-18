import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TBid } from '~/src/graphql/operations/jobBid';
import { formatRelativeTime } from '~/src/utils/utilFuncs';
import { Button, Spinner } from 'tamagui';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
type Props = {
  existingBid: TBid | undefined;
  onClick: () => void;
  loading: boolean;
};

const JobBidButton = ({ existingBid, onClick, loading }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const placedBidActive = existingBid && existingBid?.status !== 'Rejected';
  const bidTime = existingBid?.createdAt && formatRelativeTime(existingBid.createdAt);

  return (
    <Button
      backgroundColor={loading ? theme.border : theme.primary}
      color={loading ? theme.silver : '#fff'}
      style={[styles.bottomBtn, { bottom: bottom }]}
      icon={loading ? () => <Spinner /> : undefined}
      borderRadius={0}
      onPress={onClick}
      disabled={loading}>
      {placedBidActive ? `Bid Placed ${bidTime} Ago` : labels.bidThisJob}
    </Button>
  );
};

export default JobBidButton;

const getStyles = (theme: any) =>
  StyleSheet.create({
    bottomBtn: {
      width: '100%',
      fontFamily: 'InterBold',
    },
  });
