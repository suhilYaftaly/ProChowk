import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { IJob } from '~/src/graphql/operations/job';
import { TBid } from '~/src/graphql/operations/jobBid';
import { IUser } from '~/src/graphql/operations/user';
import { Button } from 'tamagui';
import BidViewDialog from './BidViewDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';

type Props = { job: IJob; bid: TBid; jobPoster: IUser | undefined };

const AcceptedBid = ({ bid, job, jobPoster }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [openBidViewDialog, setOpenBidViewDialog] = useState(false);
  return (
    <View>
      <Button
        style={[styles.bottomBtn, { bottom: bottom }]}
        borderRadius={0}
        onPress={() => setOpenBidViewDialog(true)}>
        {labels.acceptBid}
      </Button>
      {bid && jobPoster && (
        <BidViewDialog
          openDrawer={openBidViewDialog}
          setOpenDrawer={setOpenBidViewDialog}
          bid={bid}
          job={job}
          disableBidAction
          jobPoster={jobPoster}
        />
      )}
    </View>
  );
};

export default AcceptedBid;

const getStyles = (theme: any) =>
  StyleSheet.create({
    bottomBtn: {
      width: '100%',
      backgroundColor: theme.primary,
      color: '#fff',
      fontFamily: 'InterBold',
    },
  });
