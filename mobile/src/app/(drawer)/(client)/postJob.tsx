import { View, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import JobPost from '~/src/components/jobs/JobPost';
import { useUserStates } from '~/src/redux/reduxStates';
import { Text } from 'tamagui';
import Routes from '~/src/routes/Routes';
import labels from '~/src/constants/labels';

const postJob = () => {
  const path = usePathname();
  const routeParams = useLocalSearchParams();
  const { user } = useUserStates();
  const [isOpen, setIsOpen] = useState(true);

  const onCancelPress = () => {
    setIsOpen(false);
    router.navigate('/');
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
            <JobPost onCancel={() => onCancelPress()} />
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
