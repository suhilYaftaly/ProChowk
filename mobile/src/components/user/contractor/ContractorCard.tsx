import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Avatar, Circle, Separator, XStack } from 'tamagui';
import { FontAwesome, FontAwesome6, Octicons } from '@expo/vector-icons';
import CustomRating from '../../reusable/CustomRating';
import colors from '~/src/constants/colors';
import { SkillInput } from '~/src/graphql/operations/skill';
import Chip from '../../reusable/Chip';
import { IUser } from '~/src/graphql/operations/user';
import { Link } from 'expo-router';
import QrCodeModal from '../profile/QrCodeModal';
import { userWebLink } from '~/src/constants/links';
import * as Linking from 'expo-linking';

type Props = {
  user: IUser;
};
const ContractorCard = ({ user }: Props) => {
  const userMobileQRLink = Linking.createURL(`/user/${user?.id}`);

  return (
    <View style={styles.contractorCardCont}>
      <Link href={`/user/${user?.id}`} asChild>
        <Pressable style={styles.infoCont}>
          <XStack jc={'space-between'} alignItems="center">
            <View style={styles.userNameCont}>
              <Avatar circular size="$4">
                {user?.image ? (
                  <Avatar.Image accessibilityLabel={user?.name} src={user?.image?.url} />
                ) : (
                  <Avatar.Image
                    accessibilityLabel="default"
                    src={require('@assets/images/userDummy.png')}
                  />
                )}
              </Avatar>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <Circle
              size={35}
              backgroundColor={colors.primary20}
              borderColor={colors.primary}
              borderWidth={1}
              alignItems="center">
              <FontAwesome6 name="location-arrow" size={20} color={colors.primary} />
            </Circle>
          </XStack>
          {user?.averageRating && user?.averageRating > 0 ? (
            <CustomRating starRating={user?.averageRating} isDisplay={true} />
          ) : (
            <></>
          )}
          {user?.bio && (
            <Text style={styles.bioCont} numberOfLines={2} ellipsizeMode="tail">
              {user?.bio?.trim()}
            </Text>
          )}
          <View style={styles.chipsCont}>
            {user?.contractor?.skills?.map((skill: SkillInput, index: number) => {
              return <Chip key={index} label={skill?.label} isDisplay={true} />;
            })}
          </View>
        </Pressable>
      </Link>
      <Separator borderColor={colors.border} />
      <View style={styles.footerCont}>
        <XStack alignItems="center" space={'$2'}>
          <Circle backgroundColor={colors.bg} borderColor={colors.border} borderWidth={1} size={30}>
            <FontAwesome6 name="location-dot" size={15} color={colors.silver} />
          </Circle>
          <Text style={styles.cityName}>{user?.address?.city}</Text>
        </XStack>
        <XStack alignItems="center" space={'$2'}>
          <QrCodeModal
            userName={user?.name}
            qrcodeUri={userWebLink(`${user?.name}-${user?.id}`)}
            triggerButton={
              <Circle
                backgroundColor={colors.bg}
                borderColor={colors.border}
                borderWidth={1}
                size={35}>
                <Octicons name="share-android" size={17} color={colors.silver} />
              </Circle>
            }
          />

          <Circle backgroundColor={colors.bg} borderColor={colors.border} borderWidth={1} size={35}>
            <FontAwesome name="heart-o" size={17} color={colors.silver} />
          </Circle>
        </XStack>
      </View>
    </View>
  );
};

export default ContractorCard;

const styles = StyleSheet.create({
  chipsCont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
  contractorCardCont: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },

  infoCont: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userNameCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'InterBold',
    fontSize: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    width: 175,
    flexWrap: 'wrap',
  },
  bioCont: {
    fontFamily: 'InterMedium',
    fontSize: 13,
    color: colors.textDark,
    marginTop: 5,
    marginRight: 5,
  },
  footerCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cityName: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: colors.textDark,
  },
});
