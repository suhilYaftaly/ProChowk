import { Modal, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import labels from '~/src/constants/labels';
import { Avatar, Button, XStack } from 'tamagui';
import CustomRating from '~/src/components/reusable/CustomRating';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { TBid } from '~/src/graphql/operations/jobBid';
type Props = {
  bid: TBid;
  openHired: boolean;
  setOpenHired: (val: boolean) => void;
};
const HiredModal = ({ bid, openHired, setOpenHired }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  return (
    <Modal
      animationType="fade"
      visible={openHired}
      onRequestClose={() => {
        setOpenHired(!openHired);
      }}
      transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <MaterialIcons name="check-circle" size={40} color={theme.success} />
          <Text style={{ color: theme.primary, fontFamily: 'InterBold', fontSize: 18 }}>
            {labels.congratulations}
          </Text>
          <Text style={{ color: theme.textDark, fontFamily: 'InterBold', fontSize: 15 }}>
            {labels.hiredMsg}
            {bid?.contractor?.user?.name}.
          </Text>
          <Text style={{ color: theme.textDark, fontFamily: 'InterSemiBold' }}>
            {labels.startConversation}
          </Text>
          <XStack
            jc={'space-between'}
            alignItems="center"
            backgroundColor={theme.bg}
            columnGap={10}
            padding={10}
            borderRadius={10}>
            <View style={styles.postedByHeader}>
              <Avatar circular size="$4">
                {bid?.contractor?.user?.image ? (
                  <Avatar.Image
                    accessibilityLabel={bid?.contractor?.user?.name}
                    src={bid?.contractor?.user?.image?.url}
                  />
                ) : (
                  <Avatar.Image
                    accessibilityLabel="default"
                    src={require('@assets/images/userDummy.png')}
                  />
                )}
              </Avatar>
              <View>
                <Text style={[styles.labelText, { width: '95%' }]}>
                  {bid?.contractor?.user?.name}
                </Text>
                {bid?.contractor?.user?.averageRating && (
                  <CustomRating
                    starRating={bid?.contractor?.user?.averageRating}
                    isDisplay={true}
                  />
                )}
              </View>
            </View>
            <Ionicons name="chatbubble-ellipses" size={28} color={theme.textDark} />
          </XStack>
          <Button
            backgroundColor={theme.primary}
            color={theme.white}
            style={styles.button}
            onPress={() => {
              setOpenHired(false);
            }}>
            {labels?.okay}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default HiredModal;

const getStyles = (theme: any) =>
  StyleSheet.create({
    labelText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    button: {
      fontFamily: 'InterBold',
      fontSize: 15,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginTop: 30,
      marginBottom: 10,
      width: '100%',
      color: theme.white,
    },
    postedByHeader: {
      flexDirection: 'row',
      columnGap: 10,
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondary50,
    },
    modalView: {
      minHeight: '40%',
      width: '80%',
      padding: 20,
      alignItems: 'center',
      backgroundColor: theme.white,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      rowGap: 10,
    },
  });
