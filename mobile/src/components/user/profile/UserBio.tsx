import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import labels from '~/src/constants/labels';
import Card from '../../reusable/Card';
import colors from '~/src/constants/colors';
import CustomModal from '../../reusable/CustomModal';
import { Button, Spinner, TextArea } from 'tamagui';
import { IUser, useUpdateUser } from '~/src/graphql/operations/user';
import { z } from 'zod';
import Toast from 'react-native-toast-message';

type Props = {
  user?: IUser;
  isMyProfile: boolean;
};

const userBioSchema = z.string().min(5);

const UserBio = ({ user, isMyProfile }: Props) => {
  const { updateUserAsync, loading: updLoading } = useUpdateUser();
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [aboutError, setAboutError] = useState<boolean>(false);
  const [bioReadExpanded, setBioReadExpanded] = useState(false);
  const [bioEditOpen, setBioEditOpen] = useState(false);
  const [about, setAbout] = useState<string | undefined>('');

  const handleSaveChanges = () => {
    if (!userBioSchema.safeParse(about)?.success) {
      setAboutError(true);
      return;
    }
    setDisableSaveBtn(true);
    if (user) {
      const updateData = { id: user.id, edits: { bio: about } };
      updateUserAsync({
        variables: updateData,
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: `${labels.profileUpdated}`,
            position: 'top',
          });
        },
      });
      setDisableSaveBtn(false);
      setBioEditOpen(false);
    }
  };

  return (
    <>
      <Card
        isEditable={isMyProfile}
        cardLabel={labels.about}
        onEditPress={() => {
          setAbout(user?.bio?.trim());
          setBioEditOpen(true);
        }}
        children={
          <>
            <Text
              style={{ fontFamily: 'InterMedium', fontSize: 13, marginBottom: 10 }}
              numberOfLines={bioReadExpanded ? undefined : 4}
              ellipsizeMode={bioReadExpanded ? undefined : 'tail'}>
              {user?.bio?.trim()}
            </Text>
            {user?.bio && user?.bio?.trim()?.length > 150 && (
              <Pressable onPress={() => setBioReadExpanded(!bioReadExpanded)}>
                <Text style={{ fontFamily: 'InterBold', fontSize: 16, color: colors.primary }}>
                  {labels.read} {bioReadExpanded ? labels.less : labels.more}
                </Text>
              </Pressable>
            )}
          </>
        }
      />
      <CustomModal
        headerText={labels.aboutYou}
        isOpen={bioEditOpen}
        setIsOpen={setBioEditOpen}
        width={'80%'}
        dialogCom={
          <View>
            <TextArea
              placeholder={labels.tellUsAboutYou}
              size="$3"
              borderWidth={1}
              borderColor={colors.border}
              rows={7}
              style={styles.inputText}
              defaultValue={about}
              onChangeText={(e) => {
                if (aboutError) {
                  setAboutError(false);
                }
                setAbout(e);
              }}
            />
            {aboutError && <Text style={{ color: colors.error }}>*{labels.userBioError}</Text>}
            <Button
              backgroundColor={disableSaveBtn ? '$border' : '$primary'}
              color={disableSaveBtn ? '$silver' : '$white'}
              style={styles.button}
              onPress={() => handleSaveChanges()}
              disabled={disableSaveBtn}
              icon={updLoading ? () => <Spinner /> : undefined}>
              {labels?.save}
            </Button>
          </View>
        }
      />
    </>
  );
};

export default UserBio;

const styles = StyleSheet.create({
  inputText: {
    fontFamily: 'InterSemiBold',
    color: colors.textDark,
    backgroundColor: 'transparent',
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
    justifyContent: 'center',
    color: colors.white,
  },
});
