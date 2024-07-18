import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { IContractor } from '~/src/graphql/operations/contractor';
import { Image, ScrollView, Spinner } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';
import { Circle } from 'tamagui';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import {
  ContractorPortfolio,
  useDeleteContractorPortfolio,
} from '~/src/graphql/operations/contractorPortfolio';

type Props = {
  contractorData?: IContractor;
  portfolios?: ContractorPortfolio[];
  closeDialog: () => void;
};
const EditPortfolios = ({ contractorData, portfolios, closeDialog }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [delId, setDelId] = useState<string>();
  const [userPortfolios, setUserPortfolios] = useState<ContractorPortfolio[]>(
    portfolios ? portfolios : []
  );
  const { deleteContractorPortfolioAsync, loading: deleteLoading } = useDeleteContractorPortfolio();

  const handleDeletePortfolio = (id: string) => {
    if (id && contractorData?.id) {
      const contractorId = contractorData?.id;
      setDelId(id);
      deleteContractorPortfolioAsync({
        variables: { id, contractorId },
        onSuccess: () => {
          closeDialog();
          setDelId('');
          Toast.show({
            type: 'success',
            text1: `${labels.portfolioDeleted}`,
            position: 'top',
          });
        },
      });
    }
  };

  return (
    <ScrollView height={'90%'}>
      {userPortfolios && userPortfolios?.length > 0 ? (
        userPortfolios?.map((portfolio: ContractorPortfolio) => {
          return (
            <View key={portfolio?.id} style={styles.licenseCont}>
              <View style={styles.licenseHeader}>
                <Text style={styles.licenseName}>{portfolio?.title}</Text>
                <Pressable onPress={() => handleDeletePortfolio(portfolio?.id)}>
                  <Circle size={30} borderColor={theme.border} borderWidth={1}>
                    {deleteLoading && delId === portfolio?.id ? (
                      <Spinner />
                    ) : (
                      <MaterialIcons name="delete" size={20} color={theme.textDark} />
                    )}
                  </Circle>
                </Pressable>
              </View>
              <Text style={styles.licenseDesc}>{portfolio?.description}</Text>
              <View style={styles.licenseImage}>
                <Image
                  source={{
                    uri: `${portfolio?.images?.[0]?.url}`,
                  }}
                  style={{ height: 150 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          );
        })
      ) : (
        <></>
      )}
    </ScrollView>
  );
};

export default EditPortfolios;

const getStyles = (theme: any) =>
  StyleSheet.create({
    licenseCont: {
      margin: 10,
    },
    licenseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    licenseImage: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 7,
    },
    licenseName: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    licenseDesc: {
      fontFamily: 'InterRegular',
      fontSize: 15,
      color: theme.textDark,
      marginBottom: 5,
    },
  });
