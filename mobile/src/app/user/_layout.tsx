import React from 'react';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '~/src/constants/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import labels from '~/src/constants/labels';

const userLayout = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Stack>
      <Stack.Screen name="(signUp)" options={{ headerShown: false }} />
      <Stack.Screen name="(logIn)" options={{ headerShown: false }} />
      <Stack.Screen name="emailVerify" options={{ headerShown: false }} />
      <Stack.Screen
        name="[userId]"
        options={{
          header(props) {
            return (
              <View style={[styles.headerBar, { marginTop: top }]}>
                <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
                  <FontAwesome6 name="chevron-left" size={17} color={colors.white} />
                  <Text style={styles.pageName}>{labels.profile}</Text>
                </Pressable>
              </View>
            );
          },
        }}
      />
    </Stack>
  );
};

export default userLayout;

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: colors.textDark,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageName: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.white,
    marginLeft: 10,
  },
});
