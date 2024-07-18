import { ListRenderItem, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import { TUserReviewsData } from '~/src/graphql/operations/review';
import Card from '../../reusable/Card';
import labels from '~/src/constants/labels';
import CustomRating from '../../reusable/CustomRating';
import { Avatar } from 'tamagui';
import { formatDistanceToNow, parseISO } from 'date-fns';
import CustomCarousel from '../../reusable/CustomCarousel';
import { IUser } from '~/src/graphql/operations/user';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
type Props = {
  user?: IUser;
  userReviews?: TUserReviewsData;
  isMyProfile?: boolean;
};
const UserReview = ({ userReviews, isMyProfile }: Props) => {
  const { width } = useWindowDimensions();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const renderListItem: ListRenderItem<any> = ({ item }) => (
    <View style={[styles.reviewPage, { width: width * 0.8 }]}>
      <View style={styles.reviewerDetails}>
        <Avatar circular size="$4">
          {item?.reviewer?.image ? (
            <Avatar.Image
              accessibilityLabel={item?.reviewer?.name}
              src={item?.reviewer?.image?.url}
            />
          ) : (
            <Avatar.Image
              accessibilityLabel="default"
              src={require('@assets/images/userDummy.png')}
            />
          )}
        </Avatar>
        <View style={styles.reviewerNameCont}>
          <Text style={styles.reviewerName}>{item?.reviewer?.name}</Text>
          <Text style={styles.timeStampText}>
            {item?.updatedAt
              ? formatDistanceToNow(parseISO(item?.updatedAt), {
                  addSuffix: true,
                })
              : ''}
          </Text>
        </View>
      </View>
      <CustomRating starRating={item?.rating} isDisplay={true} />
      <Text style={styles.reviewCommentText} numberOfLines={3} ellipsizeMode="tail">
        {item?.comment}
      </Text>
    </View>
  );

  return (
    <Card
      cardLabel={labels.reviews}
      entityCount={userReviews?.reviews?.length}
      cardBodyStyle={styles.cardBodyStyle}
      children={
        userReviews?.totalCount && userReviews?.totalCount > 0 ? (
          <View style={{ height: 180, width: width * 0.8 }}>
            <CustomCarousel dataList={userReviews?.reviews} renderComp={renderListItem} />
          </View>
        ) : (
          <></>
        )
      }
    />
  );
};

export default UserReview;

const getStyles = (theme: any) =>
  StyleSheet.create({
    carouselCont: {
      height: '100%',
      width: '100%',
    },
    reviewPage: {
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    reviewerDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
      paddingBottom: 10,
    },
    reviewerNameCont: {
      marginLeft: 10,
    },
    reviewerName: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    timeStampText: {
      fontFamily: 'InterMedium',
      fontSize: 13,
      color: theme.silver,
    },
    reviewCommentText: {
      fontFamily: 'InterMedium',
      fontSize: 15,
      color: theme.textDark,
    },
    cardBodyStyle: {
      alignItems: 'center',
      paddingBottom: 25,
    },
  });
