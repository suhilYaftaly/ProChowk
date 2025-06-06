import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import labels from '~/src/constants/labels';
import Card from '../../reusable/Card';
import { ISkill, SkillInput, useSkills } from '~/src/graphql/operations/skill';
import Chip from '../../reusable/Chip';
import CustomModal from '../../reusable/CustomModal';
import { Button, Spinner } from 'tamagui';
import SkillSelection, { getNewSkills } from '../signUp/SkillSelection';
import { IContractor, useUpdateContSkills } from '~/src/graphql/operations/contractor';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  contractor?: IContractor;
  userSkills?: ISkill[];
  isMyProfile: boolean;
};

const UserSkills = ({ contractor, userSkills, isMyProfile }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { updateContSkillsAsync, loading } = useUpdateContSkills();
  const { updateCache } = useSkills();
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [skillError, setSkillError] = useState<boolean>(true);
  const [skillEditOpen, setSkillEditOpen] = useState(false);
  const [skills, setSkills] = useState<SkillInput[]>([]);

  const handleSaveChanges = () => {
    if (contractor && skills?.length === 0) {
      setSkillError(false);
      return;
    }
    setDisableSaveBtn(true);
    if (contractor) {
      updateContSkillsAsync({
        variables: { skills: skills, contId: contractor.id },
        onSuccess: (dt) => {
          setDisableSaveBtn(false);
          setSkillEditOpen(false);
          const newSkills = getNewSkills({
            newList: dt.skills,
            oldList: userSkills ? userSkills : [],
          });
          if (newSkills && newSkills?.length > 0) {
            updateCache('create', newSkills);
          }
          Toast.show({
            type: 'success',
            text1: `${labels.profileUpdated}`,
            position: 'top',
          });
        },
        onError: () => {
          setDisableSaveBtn(false);
          Toast.show({
            type: 'error',
            text1: `${labels.profileUpdateFailed}`,
            position: 'top',
          });
        },
      });
    }
  };

  return (
    <>
      <Card
        isEditable={isMyProfile}
        entityCount={userSkills?.length}
        onEditPress={() => {
          let userCurrSkills: SkillInput[] = [];
          userSkills?.map((skill: ISkill) => userCurrSkills.push({ label: skill?.label }));
          setSkills(userCurrSkills);
          setSkillEditOpen(true);
        }}
        cardLabel={labels.skills}
        children={
          userSkills && userSkills?.length > 0 ? (
            <View style={styles.chipsCont}>
              {userSkills?.map((skill: ISkill, index: number) => {
                return <Chip key={index} label={skill?.label} isDisplay={true} />;
              })}
            </View>
          ) : (
            <></>
          )
        }
      />
      <CustomModal
        headerText={labels.skills}
        isOpen={skillEditOpen}
        setIsOpen={setSkillEditOpen}
        width={'80%'}
        dialogCom={
          <View>
            <SkillSelection
              isLabelRequire={false}
              seleSkills={skills}
              setSeleSkills={(val: SkillInput[]) => {
                setSkills(val);
                setSkillError(true);
              }}
              isError={skillError}
              errorText={labels.noSkillError}
            />
            <Button
              backgroundColor={disableSaveBtn ? theme.border : theme.primary}
              color={disableSaveBtn ? theme.silver : theme.white}
              style={styles.button}
              onPress={() => handleSaveChanges()}
              disabled={disableSaveBtn}
              icon={loading ? () => <Spinner /> : undefined}>
              {labels?.save}
            </Button>
          </View>
        }
      />
    </>
  );
};

export default UserSkills;

const getStyles = (theme: any) =>
  StyleSheet.create({
    chipsCont: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 5,
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
      color: '#fff',
    },
  });
