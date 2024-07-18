import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NoResults } from './CustomIcons';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
type Props = {
  searchType: string;
};
const NoResultFound = ({ searchType }: Props) => {
  const { theme } = useAppTheme();
  return (
    <View style={styles.noResultsCont}>
      <NoResults size={300} />
      <Text style={{ fontFamily: 'InterBold', fontSize: 20, color: theme.textDark }}>
        {labels.no} {searchType} {labels.found}
      </Text>
      <Text style={{ fontFamily: 'InterSemiBold', fontSize: 15, color: theme.silver }}>
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
