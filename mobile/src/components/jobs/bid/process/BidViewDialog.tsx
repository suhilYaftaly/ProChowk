import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { TBid, useAcceptBid } from '~/src/graphql/operations/jobBid';
import { IJob } from '~/src/graphql/operations/job';
import { IUser } from '~/src/graphql/operations/user';
import { useUserStates } from '~/src/redux/reduxStates';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import labels from '~/src/constants/labels';
import { Avatar, Button, ScrollView, Spinner, XStack, YStack } from 'tamagui';
import { agreementTxt } from '~/src/config/data';
import { readISODate } from '~/src/utils/utilFuncs';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import CustomModal from '~/src/components/reusable/CustomModal';
import CustomRating from '~/src/components/reusable/CustomRating';
import HiredModal from './HiredModal';
import NotInterestedModal from './NotInterestedModal';
import { setShowHiredModal } from '~/src/redux/slices/bidSlice';

type Props = {
  bid: TBid;
  job: IJob;
  openDrawer: boolean;
  setOpenDrawer: (toggle: boolean) => void;
  /**disable accept/reject buttons @default false */
  disableBidAction?: boolean;
  jobPoster?: IUser;
};

const BidViewDialog = ({
  bid,
  job,
  openDrawer,
  setOpenDrawer,
  disableBidAction = false,
  jobPoster,
}: Props) => {
  const dispatch = useAppDispatch();
  const { userId } = useUserStates();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const os = Platform?.OS;
  const isISO = os === 'ios';
  const { top } = useSafeAreaInsets();
  const { acceptBidAsync, loading } = useAcceptBid();
  const ownderId = job?.userId;
  const isMyPostedJob = ownderId === userId;
  const [isBidRejected, setIsBidRejected] = useState(false);
  const [openRejected, setOpenRejected] = useState(false);
  const bidder = bid?.contractor?.user;
  const isMyBid = bidder?.id === userId;

  const acceptTheBid = () => {
    acceptBidAsync({
      variables: { bidId: bid?.id },
      onSuccess: () => {
        dispatch(setShowHiredModal(true));
      },
    });
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  return (
    <Modal animationType="fade" visible={openDrawer} onRequestClose={() => toggleDrawer()}>
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <View style={[styles.modalView]}>
          <View style={styles.pageCont}>
            <View style={[styles.headerBar, { marginTop: isISO ? top : 0 }]}>
              <Pressable style={styles.headerBackBtn} onPress={() => toggleDrawer()}>
                <FontAwesome name="chevron-left" size={20} color="#fff" />
                <View>
                  <Text style={styles.pageTitle}>{labels.bidDetails}</Text>
                </View>
              </Pressable>
            </View>
            <ScrollView marginBottom={30} backgroundColor={theme.white}>
              <YStack space={'$2.5'} padding={20}>
                <Text style={[styles.labelText, { fontSize: 17 }]}>{labels.bidInfo}</Text>
                <XStack gap={'$4'} marginVertical={10}>
                  {bid?.quote && (
                    <YStack gap={'$2.5'}>
                      <Text style={styles.labelText}>{labels.bidQuote}</Text>
                      <Text style={styles.normalText}>${bid?.quote}</Text>
                    </YStack>
                  )}
                  {bid?.startDate && (
                    <YStack gap={'$2.5'}>
                      <Text style={styles.labelText}>{labels.startDate}</Text>
                      <Text style={styles.normalText}>{readISODate(bid?.startDate)}</Text>
                    </YStack>
                  )}
                  {bid?.endDate && (
                    <YStack gap={'$2.5'}>
                      <Text style={styles.labelText}>{labels.endDate}</Text>
                      <Text style={styles.normalText}>{readISODate(bid?.endDate)}</Text>
                    </YStack>
                  )}
                </XStack>
                <YStack space={'$2.5'}>
                  <Text style={styles.labelText}>
                    {labels.contractorProposal} <Text style={{ color: theme.primary }}>*</Text>
                  </Text>
                  <Text style={styles.normalText}>{bid?.proposal}</Text>
                </YStack>
                <YStack space={'$2.5'}>
                  <Text style={styles.labelText}>
                    {labels.agreement} <Text style={{ color: theme.primary }}>*</Text>
                  </Text>
                  <ScrollView maxHeight={'$15'}>
                    <Text style={styles.normalText}>{agreementTxt}</Text>
                  </ScrollView>
                </YStack>
                <View style={styles.commCard}>
                  <Text style={[styles.labelText, { fontSize: 18 }]}>{labels.commText}</Text>
                  <Ionicons name="chatbubble-ellipses" size={28} color={theme.primary} />
                </View>
              </YStack>
            </ScrollView>
            {!disableBidAction && isMyPostedJob && !isBidRejected && (
              <View style={styles.footerBar}>
                <Text
                  style={[
                    styles.labelText,
                    { fontSize: 18, textAlign: 'center', marginBottom: 10 },
                  ]}>
                  {labels.acceptBidText}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Button
                    style={[
                      styles.footerBtn,
                      { backgroundColor: theme.success, color: theme.white },
                    ]}
                    icon={loading ? <Spinner /> : undefined}
                    disabled={loading}
                    onPress={acceptTheBid}
                    unstyled>
                    {labels.yesHire}
                  </Button>
                  <Button
                    style={[
                      styles.footerBtn,
                      { backgroundColor: theme.primary, color: theme.white },
                    ]}
                    onPress={() => setOpenRejected(!openRejected)}
                    unstyled>
                    {labels.notInterested}
                  </Button>
                </View>
              </View>
            )}
            <NotInterestedModal
              bidId={bid?.id}
              openRejected={openRejected}
              setOpenRejected={(val: boolean) => setOpenRejected(val)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BidViewDialog;

const getStyles = (theme: any) =>
  StyleSheet.create({
    pageCont: {
      flex: 1,
    },
    modalView: {
      width: '100%',
      height: '100%',
    },
    headerBar: {
      backgroundColor: theme.secondaryDark,
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    headerBackBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pageTitle: {
      fontFamily: 'InterExtraBold',
      fontSize: 18,
      color: '#fff',
      marginLeft: 10,
    },
    bottomBtn: {
      width: '100%',
      backgroundColor: theme.primary,
      color: theme.white,
      fontFamily: 'InterBold',
    },
    labelText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    normalText: {
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      color: theme.silver,
    },
    commCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: theme?.bg,
      borderColor: theme?.border,
      borderWidth: 1,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    footerBar: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      shadowColor: theme.silver,
      shadowOffset: { height: 10, width: 10 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 10,
      flexDirection: 'column',
      backgroundColor: theme.white,
      padding: 15,
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
