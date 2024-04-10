import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Input, Separator } from 'tamagui';
import colors from '~/src/constants/colors';
import FilterDrawerContent from '~/src/components/user/drawer/FilterDrawerContent';
import labels from '~/src/constants/labels';

const contractorLayout = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: colors.secondary50,
      }}
      drawerContent={(props) => <FilterDrawerContent {...props} />}>
      <Drawer.Screen
        name="index"
        options={{
          swipeEnabled: false,

          header(props) {
            return (
              <View style={styles.searchContainer}>
                <FontAwesome name="search" size={20} color={colors.silver} />
                <Input
                  size={'$3'}
                  flex={1}
                  borderWidth={0}
                  style={styles.inputText}
                  placeholder={labels.searchForContractors}
                  autoCorrect={false}
                  value={searchInputValue}
                  onChangeText={(e) => setSearchInputValue(e)}
                />
                <Separator
                  vertical={true}
                  height={30}
                  borderColor={colors.border}
                  marginHorizontal={10}
                />
                <Pressable onPress={() => props.navigation.openDrawer()}>
                  <FontAwesome
                    name="filter"
                    size={20}
                    color={colors.textDark}
                    style={{ paddingHorizontal: 10 }}
                  />
                </Pressable>
              </View>
            );
          },
        }}
      />
    </Drawer>
  );
};

export default contractorLayout;

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.white,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
});
