import { View, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, usePathname } from 'expo-router';

import { useUserStates } from '~/src/redux/reduxStates';
import { Text } from 'tamagui';
import Routes from '~/src/routes/Routes';
import labels from '~/src/constants/labels';
import JobPost from '~/src/components/jobs/jobPost/JobPost';
import Toast from 'react-native-toast-message';

const postJob = () => {
  const path = usePathname();
  const routeParams = useLocalSearchParams();
  const { user } = useUserStates();
  const [isOpen, setIsOpen] = useState(true);

  const onCancelPress = (isJobPosted: boolean) => {
    setIsOpen(false);
    if (isJobPosted) {
      Toast.show({
        type: 'success',
        text1: `${labels.postJobSuccessMsg}`,
        position: 'top',
      });
    }
    router.navigate(`/${Routes.contractorHome}`);
  };

  useEffect(() => {
    if (routeParams?.isOpen && path === Routes.postJob) {
      if (user) setIsOpen(routeParams?.isOpen === 'true' ? true : false);
      else router.navigate(Routes.login);
    }
  }, [routeParams]);

  return (
    <View>
      {user ? (
        <Modal
          animationType="fade"
          visible={isOpen}
          onRequestClose={() => {
            setIsOpen(!isOpen);
          }}>
          <View style={[styles.modalView]}>
            <JobPost onCancel={onCancelPress} />
          </View>
        </Modal>
      ) : (
        <Text>{labels.postJobLogInMsg}</Text>
      )}
    </View>
  );
};

export default postJob;
const styles = StyleSheet.create({
  modalView: {
    width: '100%',
    height: '100%',
  },
});
