import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Circle, Input, ScrollView, Separator, useWindowDimensions } from 'tamagui';
import labels from '~/src/constants/labels';
import FullScreenDialog from '../../reusable/FullScreenDialog';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import NoResultFound from '../../reusable/NoResultFound';
import { ISkill, useSkills } from '~/src/graphql/operations/skill';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { setContFilters } from '~/src/redux/slices/userSlice';
import { useUserStates } from '~/src/redux/reduxStates';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const SearchContractor = (props: any) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { contFilters, userId } = useUserStates();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState<string>('');
  const [searchedSkills, setSearchedSkills] = useState<ISkill[]>([]);
  const { skillsAsync, data: allSkillsType, loading: allSkillsLoading } = useSkills();
  const allSkillsData = allSkillsType?.skills;

  const handleSearchItemClick = (value: string) => {
    searchContractor(value);
  };

  const searchContractor = (searchText: string) => {
    setIsOpen(false);
    setInputValue(searchText);
    setDisplayValue(searchText);
    if (searchText && contFilters) {
      dispatch(
        setContFilters({
          ...{ searchText: searchText },
          ...contFilters,
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
    if (contFilters) {
      dispatch(
        setContFilters({
          searchText: displayValue ? displayValue : '',
          radius: contFilters?.radius,
          latLng: contFilters?.latLng,
          address: contFilters?.address,
        })
      );
    }
  }, [displayValue]);

  return (
    <View style={userId ? styles.searchBarCont : styles.homePageSearchCont}>
      <View
        style={[
          styles.searchBtnContainer,
          { width: userId ? '85%' : '100%', justifyContent: userId ? undefined : 'space-between' },
        ]}>
        {userId && (
          <FontAwesome
            name="search"
            size={20}
            color={theme.silver}
            style={{ paddingHorizontal: 10 }}
          />
        )}
        <FullScreenDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          triggerBtnCom={
            <View
              style={[
                styles.menuButton,
                { width: width * 0.6, marginLeft: userId ? undefined : 10 },
              ]}>
              <Text style={{ color: theme.silver }}>
                {displayValue && displayValue !== '' ? displayValue : labels?.searchForContractors}
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
                  <FontAwesome6 name="angle-left" size={20} color={theme.black} />
                </Pressable>
                <Input
                  size={'$3'}
                  flex={1}
                  borderWidth={0}
                  style={styles.inputText}
                  placeholder={labels.searchSkills}
                  autoCorrect={false}
                  value={inputValue}
                  onChangeText={(e) => onInputChange(e)}
                />
                {inputValue && inputValue !== '' && (
                  <Pressable onPress={() => searchContractor(inputValue)} style={styles.addBtn}>
                    <FontAwesome name="search" size={20} color={theme.textBlue} />
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
                          <Text style={{ color: theme.textDark }}>{skill?.label}</Text>
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
              color={theme.textDark}
              style={{ paddingHorizontal: 10 }}
            />
          </Pressable>
        )}
        {!userId && (
          <Circle size={35} backgroundColor={theme.primary}>
            <FontAwesome
              name="search"
              size={17}
              color={theme.white}
              style={{ paddingHorizontal: 10 }}
            />
          </Circle>
        )}
      </View>
      {userId && (
        <>
          <Separator vertical={true} height={30} borderColor={theme.border} marginHorizontal={10} />
          <Pressable onPress={() => props.navigation.openDrawer()}>
            <FontAwesome
              name="filter"
              size={20}
              color={theme.textDark}
              style={{ paddingHorizontal: 10 }}
            />
          </Pressable>
        </>
      )}
    </View>
  );
};

export default SearchContractor;

const getStyles = (theme: any) =>
  StyleSheet.create({
    searchBarCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.white,
      padding: 10,
    },
    homePageSearchCont: {
      backgroundColor: theme.white,
      borderRadius: 50,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    searchBtnContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    menuButton: {
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      color: theme.silver,
      padding: 5,
    },
    searchContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 7,
      marginTop: 30,
    },
    inputText: {
      color: theme.textDark,
      fontFamily: 'InterSemiBold',
      fontSize: 15,
      backgroundColor: 'transparent',
    },
    itemCont: {
      padding: 15,
      flex: 1,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: theme.border,
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
