import React from 'react';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';

const JobLayout = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Stack>
      <Stack.Screen
        name="[jobId]"
        options={{
          header(props) {
            return (
              <View style={[styles.headerBar, { marginTop: top }]}>
                <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
                  <FontAwesome6 name="chevron-left" size={17} color={colors.white} />
                  <Text style={styles.pageName}>{labels.jobDetails}</Text>
                </Pressable>
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        name="jobList"
        options={{
          header(props) {
            return (
              <View style={[styles.headerBar, { marginTop: top }]}>
                <Pressable style={styles.headerBackBtn} onPress={() => router.back()}>
                  <FontAwesome6 name="chevron-left" size={17} color={colors.white} />
                  <Text style={styles.pageName}>{labels.jobList}</Text>
                </Pressable>
              </View>
            );
          },
        }}
      />
    </Stack>
  );
};

export default JobLayout;

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
