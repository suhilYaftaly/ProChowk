import { ListRenderItem, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import { IUser } from '~/src/graphql/operations/user';
import { Avatar, Separator, XStack } from 'tamagui';
import { TUserReviewsData } from '~/src/graphql/operations/review';
import { AntDesign } from '@expo/vector-icons';
import CustomCarousel from '../../reusable/CustomCarousel';
import CustomRating from '../../reusable/CustomRating';
import { getRandomString } from '~/src/utils/utilFuncs';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

interface Props {
  loading: boolean;
  user: IUser | undefined;
  title?: string;
  userReviewData?: TUserReviewsData;
}
const PostedBy = ({ loading, user, title, userReviewData }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const renderListItem: ListRenderItem<any> = ({ item }) => (
    <View key={getRandomString(5)} style={[styles.reviewPage, { width: width * 0.8 }]}>
      <CustomRating starRating={item?.rating} isDisplay={true} />
      <Text style={styles.reviewCommentText} numberOfLines={3} ellipsizeMode="tail">
        {item?.comment}
      </Text>
    </View>
  );
  return (
    <View style={styles.postedByCont}>
      <XStack jc={'space-between'} alignItems="center">
        <View style={styles.postedByHeader}>
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
          <View>
            <Text style={{ color: theme.textDark }}>Posted By</Text>
            <Text style={styles.boldText}>{user?.name}</Text>
          </View>
        </View>
        {userReviewData && userReviewData?.averageRating && userReviewData?.averageRating > 0 ? (
          <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>
            <AntDesign name="star" size={20} color={theme.primary} />
            <Text style={[styles.boldText, { color: theme.primary, marginLeft: 5 }]}>
              {userReviewData?.averageRating}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </XStack>
      {userReviewData?.totalCount && userReviewData?.totalCount > 0 ? (
        <>
          <Separator borderColor={theme.border} />
          <View style={{ height: 180, width: width * 0.8, marginTop: 10, alignSelf: 'center' }}>
            <CustomCarousel dataList={userReviewData?.reviews} renderComp={renderListItem} />
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default PostedBy;

const getStyles = (theme: any) =>
  StyleSheet.create({
    boldText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    postedByCont: {
      backgroundColor: theme.white,
      margin: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
    postedByHeader: {
      flexDirection: 'row',
      columnGap: 10,
      alignItems: 'center',
      marginBottom: 10,
    },
    reviewPage: {
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    reviewCommentText: {
      fontFamily: 'InterMedium',
      fontSize: 15,
      color: theme.textDark,
    },
  });
