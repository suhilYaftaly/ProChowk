import { Image, ListRenderItem, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React from 'react';
import Card from '../../reusable/Card';
import labels from '~/src/constants/labels';
import { ILicense } from '~/src/graphql/operations/contractor';
import colors from '~/src/constants/colors';
import CustomCarousel from '../../reusable/CustomCarousel';
import { IUser } from '~/src/graphql/operations/user';
type Props = {
  user?: IUser;
  licenses?: ILicense[];
  isMyProfile: boolean;
};

const UserLicenses = ({ licenses, isMyProfile }: Props) => {
  const { width } = useWindowDimensions();
  const renderListItem: ListRenderItem<any> = ({ item }) => (
    <View style={[styles.licensePage, { width: width * 0.8 }]}>
      <Image
        style={styles.licenseImage}
        source={{
          uri: `${item?.url}`,
        }}
        resizeMode="contain"
      />
      <Text style={styles.licenseName} numberOfLines={2} ellipsizeMode={'tail'}>
        {item?.name}
      </Text>
    </View>
  );

  return (
    <Card
      isEditable={isMyProfile}
      entityCount={licenses?.length}
      cardLabel={labels.licenses}
      cardBodyStyle={styles.cardBodyStyle}
      children={
        licenses && licenses?.length > 0 ? (
          <View style={{ height: 200, width: width * 0.8 }}>
            <CustomCarousel dataList={licenses} renderComp={renderListItem} />
          </View>
        ) : (
          <></>
        )
      }
    />
  );
};

export default UserLicenses;

const styles = StyleSheet.create({
  carouselCont: {
    height: '100%',
    width: '100%',
  },
  licensePage: {
    flexDirection: 'column',
  },
  licenseImage: {
    height: 150,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 7,
  },
  licenseName: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.textDark,
    marginVertical: 10,
  },
  cardBodyStyle: {
    alignItems: 'center',
    paddingBottom: 25,
  },
});
