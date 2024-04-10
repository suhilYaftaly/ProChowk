import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
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
import colors from '~/src/constants/colors';
import QrCodeModal from './QrCodeModal';
import { userLink } from '~/src/constants/links';
type Props = {
  userData?: IUser;
  reviewData?: TUserReviewsData;
  isMyProfile: boolean;
};
const ProfileHeader = ({ userData, reviewData, isMyProfile }: Props) => {
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
              <Text style={[styles.userName, { marginRight: 10 }]}>{userData?.name}</Text>
              {reviewData?.averageRating ? (
                <>
                  <AntDesign name="star" size={20} color={colors.primary} />
                  <Text style={[styles.userName, { color: colors.primary, marginLeft: 5 }]}>
                    {reviewData?.averageRating}
                  </Text>
                </>
              ) : (
                <></>
              )}
            </View>
            <View style={[styles.contactDetails, { marginBottom: 10 }]}>
              {/*  {userData?.phoneNum && (
                <XStack space={'$2'} marginRight={15} alignItems="center">
                  <Circle backgroundColor={colors.silver} size={20}>
                    <Ionicons name="call" size={10} color={colors.white} />
                  </Circle>
                  <Text style={styles.normalText}>{userData?.phoneNum}</Text>
                </XStack>
              )} */}
              <XStack space={'$2'} alignItems="center">
                <FontAwesome6 name="location-dot" size={20} color={colors.silver} />
                <Text style={styles.normalText}>
                  {userData?.address?.city}, {userData?.address?.stateCode}
                </Text>
              </XStack>
            </View>
            {isMyProfile && (
              <XStack space={'$2'} alignItems="center">
                <Ionicons name="mail" size={20} color={colors.silver} />
                <Text style={styles.normalText}>{userData?.email}</Text>
              </XStack>
            )}
          </View>
        </View>
        {isMyProfile && (
          <Circle
            size={30}
            borderColor={colors.border}
            borderWidth={1}
            marginRight={10}
            marginTop={15}>
            <FontAwesome5 name="pen" size={13} color={colors.textDark} />
          </Circle>
        )}
      </View>
      <Separator borderColor={colors.border} />
      <View style={[styles.contactDetails, { width: '100%', justifyContent: 'space-evenly' }]}>
        <QrCodeModal
          qrcodeUri={userLink(`${userData?.name}-${userData?.id}`)}
          triggerButton={
            <XStack space={'$2'} alignItems="center" justifyContent="center" padding={10}>
              <Circle
                borderColor={colors.border}
                borderWidth={1}
                backgroundColor={colors.bg}
                size={35}>
                <MaterialCommunityIcons name="qrcode-scan" size={20} color={colors.textDark} />
              </Circle>
              <Text style={styles.userName}>Qr Code</Text>
            </XStack>
          }
        />
        {isMyProfile && (
          <XStack space={'$2'} alignItems="center" justifyContent="center" padding={10}>
            <Circle
              borderColor={colors.border}
              borderWidth={1}
              backgroundColor={colors.bg}
              size={35}>
              <Ionicons name="settings" size={20} color={colors.textDark} />
            </Circle>
            <Text style={styles.userName}>Settings</Text>
          </XStack>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  profileHeader: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
  },
  userDetailsCont: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
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
  userName: { fontFamily: 'InterExtraBold', fontSize: 18, color: colors.textDark },
  normalText: { fontFamily: 'InterMedium', fontSize: 13, color: colors.silver },
});
