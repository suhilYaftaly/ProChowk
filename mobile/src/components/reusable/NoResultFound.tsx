import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomIcons from './CustomIcons';
import colors from '~/src/constants/colors';
import labels from '~/src/constants/labels';
type Props = {
  searchType: string;
};
const NoResultFound = ({ searchType }: Props) => {
  return (
    <View style={styles.noResultsCont}>
      <CustomIcons name="noResults" size={300} />
      <Text style={{ fontFamily: 'InterBold', fontSize: 20, color: colors.textDark }}>
        {labels.no} {searchType} {labels.found}
      </Text>
      <Text style={{ fontFamily: 'InterSemiBold', fontSize: 15, color: colors.silver }}>
        {labels.changeSearchCriteria}
      </Text>
    </View>
  );
};

export default NoResultFound;

const styles = StyleSheet.create({
  noResultsCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
