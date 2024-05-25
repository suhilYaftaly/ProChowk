import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '~/src/constants/colors';
import { AntDesign, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import FullScreenDialog from '../../reusable/FullScreenDialog';
import { Input, ScrollView, Separator, useWindowDimensions } from 'tamagui';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import NoResultFound from '../../reusable/NoResultFound';
import labels from '~/src/constants/labels';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { useUserStates } from '~/src/redux/reduxStates';
import { ISkill, useSkills } from '~/src/graphql/operations/skill';
import { setProjectsFilters } from '~/src/redux/slices/userSlice';

const SearchProjects = (props: any) => {
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { projectFilters } = useUserStates();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState<string>('');
  const [searchedSkills, setSearchedSkills] = useState<ISkill[]>([]);
  const { skillsAsync, data: allSkillsType, loading: allSkillsLoading } = useSkills();
  const allSkillsData = allSkillsType?.skills;

  const handleSearchItemClick = (value: string) => {
    searchProjects(value);
  };

  const searchProjects = (searchText: string) => {
    setIsOpen(false);
    setInputValue(searchText);
    setDisplayValue(searchText);
    if (searchText && projectFilters) {
      dispatch(
        setProjectsFilters({
          ...{ searchText: searchText },
          ...projectFilters,
        })
      );
    }
  };

  const onInputChange = (val: string) => {
    setInputValue(val);
    getAllSkills(val);
  };
  const clearInput = () => {
    setInputValue('');
    setDisplayValue('');
  };

  const getAllSkills = (search: string) => {
    skillsAsync({ variables: { search } });
  };

  useEffect(() => {
    if (allSkillsData) setSearchedSkills(allSkillsData);
  }, [allSkillsData]);

  useEffect(() => {
    if (projectFilters) {
      dispatch(
        setProjectsFilters({
          ...projectFilters,
          ...{
            searchText: displayValue ? displayValue : undefined,
          },
        })
      );
    }
  }, [displayValue]);

  return (
    <View style={styles.searchBarCont}>
      <View style={styles.searchBtnContainer}>
        <FontAwesome
          name="search"
          size={20}
          color={colors.silver}
          style={{ paddingHorizontal: 10 }}
        />
        <FullScreenDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          triggerBtnCom={
            <View style={[styles.menuButton, { width: width * 0.6 }]}>
              <Text>
                {displayValue && displayValue !== '' ? displayValue : labels?.searchForProjects}
              </Text>
            </View>
          }
          dialogCom={
            <>
              <View style={styles.searchContainer}>
                <Pressable
                  onPress={() => {
                    setIsOpen(false);
                    setDisplayValue(inputValue);
                  }}
                  style={styles.addBtn}>
                  <FontAwesome6 name="angle-left" size={20} color={colors.black} />
                </Pressable>
                <Input
                  size={'$3'}
                  flex={1}
                  borderWidth={0}
                  style={styles.inputText}
                  placeholder={labels.searchAddress}
                  autoCorrect={false}
                  value={inputValue}
                  onChangeText={(e) => onInputChange(e)}
                />
                {inputValue && inputValue !== '' && (
                  <Pressable onPress={() => searchProjects(inputValue)} style={styles.addBtn}>
                    <FontAwesome name="search" size={20} color={colors.textBlue} />
                  </Pressable>
                )}
              </View>
              <Separator />
              {allSkillsLoading ? (
                <CustomContentLoader type={'list'} size={15} repeat={5} />
              ) : searchedSkills && searchedSkills?.length > 0 ? (
                <ScrollView>
                  {searchedSkills?.map((skill: ISkill, index: number) => {
                    return (
                      <Pressable key={index} onPress={() => handleSearchItemClick(skill?.label)}>
                        <View style={styles.itemCont}>
                          <Text>{skill?.label}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              ) : (
                inputValue && <NoResultFound searchType={labels.contractor.toLowerCase()} />
              )}
            </>
          }
        />
        {displayValue && displayValue !== '' && (
          <Pressable onPress={() => clearInput()}>
            <AntDesign
              name="closecircle"
              size={20}
              color={colors.textDark}
              style={{ paddingHorizontal: 10 }}
            />
          </Pressable>
        )}
      </View>
      <Separator vertical={true} height={30} borderColor={colors.border} marginHorizontal={10} />
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
};

export default SearchProjects;

const styles = StyleSheet.create({
  searchBarCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 10,
  },
  searchBtnContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '85%',
  },
  menuButton: {
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    color: colors.silver,
    padding: 5,
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    marginTop: 30,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  itemCont: {
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
});
