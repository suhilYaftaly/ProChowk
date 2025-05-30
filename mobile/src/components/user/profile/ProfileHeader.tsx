import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Avatar, Circle, Separator, XStack } from 'tamagui';
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { IUser } from '~/src/graphql/operations/user';
import { TUserReviewsData } from '~/src/graphql/operations/review';
import QrCodeModal from './QrCodeModal';
import { userWebLink } from '~/src/constants/links';
import CustomModal from '../../reusable/CustomModal';
import ProfileHeaderEdit from './editModals/ProfileHeaderEdit';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
type Props = {
  userData?: IUser;
  reviewData?: TUserReviewsData;
  isMyProfile: boolean;
};
const ProfileHeader = ({ userData, reviewData, isMyProfile }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [settingsEditOpen, setSettingsEditOpen] = useState(false);
  return (
    <View style={styles.profileHeader}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <View style={styles.userDetailsCont}>
          <Avatar circular size="$6">
            {userData?.image ? (
              <Avatar.Image accessibilityLabel={userData?.name} src={userData?.image?.url} />
            ) : (
              <Avatar.Image
                accessibilityLabel="default"
                src={require('@assets/images/userDummy.png')}
              />
            )}
          </Avatar>
          <View style={styles.userDetails}>
            <View style={[styles.contactDetails, { marginBottom: 10 }]}>
              <Text style={styles.userName}>{userData?.name}</Text>
              {reviewData?.averageRating ? (
                <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                  <AntDesign name="star" size={20} color={theme.primary} />
                  <Text style={[styles.userName, { color: theme.primary, marginLeft: 5 }]}>
                    {reviewData?.averageRating}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </View>
            <View style={[styles.contactDetails, { marginBottom: 10 }]}>
              {/*  {userData?.phoneNum && (
                <XStack space={'$2'} marginRight={15} alignItems="center">
                  <Circle backgroundColor={theme.silver} size={20}>
                    <Ionicons name="call" size={10} color={theme.white} />
                  </Circle>
                  <Text style={styles.normalText}>{userData?.phoneNum}</Text>
                </XStack>
              )} */}
              {userData?.address && (
                <XStack space={'$2'} alignItems="center">
                  <FontAwesome6 name="location-dot" size={20} color={theme.silver} />
                  <Text style={styles.normalText}>
                    {userData?.address?.city}, {userData?.address?.stateCode}
                  </Text>
                </XStack>
              )}
            </View>
            {isMyProfile && (
              <XStack space={'$2'} alignItems="center">
                <Ionicons name="mail" size={20} color={theme.silver} />
                <Text style={styles.normalText}>{userData?.email}</Text>
              </XStack>
            )}
          </View>
        </View>
        {isMyProfile && (
          <Pressable onPress={() => setProfileEditOpen(!profileEditOpen)}>
            <Circle
              size={30}
              borderColor={theme.border}
              borderWidth={1}
              marginRight={10}
              marginTop={15}>
              <FontAwesome5 name="pen" size={13} color={theme.textDark} />
            </Circle>
          </Pressable>
        )}
      </View>
      <Separator borderColor={theme.border} />
      <View style={[styles.contactDetails, { width: '100%', justifyContent: 'space-evenly' }]}>
        <QrCodeModal
          userName={userData?.name}
          qrcodeUri={userWebLink(`${userData?.name}-${userData?.id}`)}
          triggerButton={
            <XStack space={'$2'} alignItems="center" justifyContent="center" padding={10}>
              <Circle
                borderColor={theme.border}
                borderWidth={1}
                backgroundColor={theme.bg}
                size={35}>
                <MaterialCommunityIcons name="qrcode-scan" size={20} color={theme.textDark} />
              </Circle>
              <Text style={styles.userName}>{labels.qrCode}</Text>
            </XStack>
          }
        />
        {isMyProfile && (
          <XStack
            space={'$2'}
            alignItems="center"
            justifyContent="center"
            padding={10}
            onPress={() => setSettingsEditOpen(!settingsEditOpen)}>
            <Circle borderColor={theme.border} borderWidth={1} backgroundColor={theme.bg} size={35}>
              <Ionicons name="settings" size={20} color={theme.textDark} />
            </Circle>
            <Text style={styles.userName}>{labels.settings}</Text>
          </XStack>
        )}
      </View>
      <CustomModal
        headerText="Profile Info"
        isOpen={profileEditOpen}
        setIsOpen={setProfileEditOpen}
        width={'90%'}
        dialogCom={
          <ProfileHeaderEdit userData={userData} closeDialog={() => setProfileEditOpen(false)} />
        }
      />
      <CustomModal
        headerText="Settings"
        isOpen={settingsEditOpen}
        setIsOpen={setSettingsEditOpen}
        width={'80%'}
        dialogCom={<></>}
      />
    </View>
  );
};

export default ProfileHeader;

const getStyles = (theme: any) =>
  StyleSheet.create({
    profileHeader: {
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
      backgroundColor: theme.white,
    },
    userDetailsCont: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 20,
      alignItems: 'center',
      width: '70%',
    },
    userDetails: {
      marginLeft: 15,
      flexDirection: 'column',
    },
    contactDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    userName: { fontFamily: 'InterExtraBold', fontSize: 18, color: theme.textDark },
    normalText: { fontFamily: 'InterMedium', fontSize: 13, color: theme.silver },
  });
