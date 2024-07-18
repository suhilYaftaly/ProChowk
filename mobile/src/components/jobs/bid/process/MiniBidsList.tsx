import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { IJob } from '~/src/graphql/operations/job';
import { TBid } from '~/src/graphql/operations/jobBid';
import CustomSheet from '~/src/components/reusable/CustomSheet';
import { Avatar, Button, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import labels from '~/src/constants/labels';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { XStack } from 'tamagui';
import { getRandomString, readISODate } from '~/src/utils/utilFuncs';
import BidViewDialog from './BidViewDialog';
import { IUser } from '~/src/graphql/operations/user';

type Props = { job: IJob; bids: TBid[]; jobPoster?: IUser };

const MiniBidsList = ({ bids, job, jobPoster }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [openBidViewDialog, setOpenBidViewDialog] = useState(false);
  const [openBidSheet, setOpenBidSheet] = useState(false);
  const [activeBid, setActiveBid] = useState<TBid>();

  const handleBidPress = (bidId: string) => {
    const seleBid = bids.find((bid) => bid.id === bidId);
    if (seleBid) {
      setActiveBid(seleBid);
      setOpenBidViewDialog(true);
    }
  };
  return (
    <View>
      <Button
        style={[styles.bottomBtn, { bottom: bottom }]}
        borderRadius={0}
        iconAfter={<FontAwesome name="chevron-up" size={17} color={theme.white} />}
        onPress={() => setOpenBidSheet(true)}>
        <Text style={{ color: theme.white, fontFamily: 'InterBold' }}>
          {labels.viewAllBids} ({bids?.length})
        </Text>
      </Button>
      <CustomSheet
        isOpen={openBidSheet}
        setIsOpen={setOpenBidSheet}
        snapPoints={[50, 80]}
        sheetTitle={labels.bids}
        counter={bids?.length}>
        <View style={styles.bidsCont}>
          {bids?.map((bid) => (
            <Pressable key={bid?.id} onPress={() => handleBidPress(bid?.id)}>
              <XStack
                jc={'space-between'}
                alignItems="center"
                backgroundColor={theme.white}
                columnGap={10}
                borderWidth={1}
                borderColor={theme.border}
                padding={10}
                borderRadius={10}>
                <View style={styles.postedByHeader}>
                  <Avatar circular size="$4">
                    {bid?.contractor?.user?.image ? (
                      <Avatar.Image
                        accessibilityLabel={bid?.contractor?.user?.name}
                        src={bid?.contractor?.user?.image?.url}
                      />
                    ) : (
                      <Avatar.Image
                        accessibilityLabel="default"
                        src={require('@assets/images/userDummy.png')}
                      />
                    )}
                  </Avatar>
                  <View>
                    <Text style={styles.labelText}>{bid?.contractor?.user?.name}</Text>
                    {bid?.createdAt && (
                      <Text style={{ color: theme.textDark }}>{readISODate(bid?.createdAt)}</Text>
                    )}
                  </View>
                </View>
                <YStack alignItems="center">
                  <Text style={styles.labelText}>Quote:</Text>
                  <Text style={{ color: theme.primary, fontFamily: 'InterBold' }}>
                    ${bid?.quote}
                  </Text>
                </YStack>
              </XStack>
            </Pressable>
          ))}
        </View>
      </CustomSheet>
      {activeBid && jobPoster && (
        <BidViewDialog
          openDrawer={openBidViewDialog}
          setOpenDrawer={setOpenBidViewDialog}
          bid={activeBid}
          job={job}
          jobPoster={jobPoster}
        />
      )}
    </View>
  );
};

export default MiniBidsList;

const getStyles = (theme: any) =>
  StyleSheet.create({
    bottomBtn: {
      width: '100%',
      backgroundColor: theme.primary,
      color: theme.white,
      fontFamily: 'InterBold',
    },
    postedByHeader: {
      flexDirection: 'row',
      columnGap: 10,
      alignItems: 'center',
    },
    labelText: {
      fontFamily: 'InterBold',
      fontSize: 16,
      color: theme.textDark,
    },
    bidsCont: {
      paddingVertical: 10,
    },
  });
