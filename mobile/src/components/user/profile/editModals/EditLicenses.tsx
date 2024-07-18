import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  IContractor,
  ILicense,
  useDeleteContractorLicense,
} from '~/src/graphql/operations/contractor';
import { Image, ScrollView, Spinner } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';
import { Circle } from 'tamagui';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  contractorData?: IContractor;
  licenses?: ILicense[];
  closeDialog: () => void;
};

const EditLicenses = ({ contractorData, licenses, closeDialog }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [delId, setDelId] = useState<string>();
  const [userlicenses, setUSerLicenses] = useState<ILicense[]>(licenses ? licenses : []);
  const { deleteContLicAsync, loading: deleteLoading } = useDeleteContractorLicense();

  const handleDeleteLicense = (id: string) => {
    if (id && contractorData?.id) {
      setDelId(id);
      deleteContLicAsync({
        variables: { licId: id, contId: contractorData?.id },
        onSuccess: () => {
          closeDialog();
          setDelId('');
          Toast.show({
            type: 'success',
            text1: `${labels.licenseDeleted}`,
            position: 'top',
          });
        },
      });
    }
  };

  return (
    <ScrollView height={'90%'}>
      {userlicenses && userlicenses?.length > 0 ? (
        userlicenses?.map((license: ILicense) => {
          return (
            <View key={license?.id} style={styles.licenseCont}>
              <View style={styles.licenseHeader}>
                <Text style={styles.licenseName}>{license?.name}</Text>
                <Pressable onPress={() => handleDeleteLicense(license?.id)}>
                  <Circle size={30} borderColor={theme.border} borderWidth={1}>
                    {deleteLoading && delId === license?.id ? (
                      <Spinner />
                    ) : (
                      <MaterialIcons name="delete" size={20} color={theme.textDark} />
                    )}
                  </Circle>
                </Pressable>
              </View>
              <View style={styles.licenseImage}>
                <Image
                  source={{
                    uri: `${license?.url}`,
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

export default EditLicenses;

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
      marginVertical: 10,
    },
  });
