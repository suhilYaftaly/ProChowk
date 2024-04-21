import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { ReactElement } from 'react';
import colors from '~/src/constants/colors';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { Circle } from 'tamagui';
type Props = {
  isEditable?: boolean;
  cardLabel: string;
  entityCount?: number;
  children: ReactElement;
  cardBodyStyle?: StyleProp<ViewStyle>;
  onEditPress?: () => void;
  isAddAvailable?: boolean;
  onAddPress?: () => void;
};
const Card = ({
  isEditable = false,
  cardLabel,
  children,
  entityCount,
  cardBodyStyle = styles.basicBodyStyle,
  onEditPress,
  isAddAvailable = false,
  onAddPress,
}: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderCon}>
        <Text style={styles.cardHeader}>
          {cardLabel}{' '}
          {entityCount !== undefined && entityCount >= 0 && (
            <Text style={styles.entityCount}>({entityCount})</Text>
          )}
        </Text>
        <View style={styles.actionCont}>
          {isAddAvailable && (
            <Pressable
              onPress={() => {
                onAddPress ? onAddPress() : {};
              }}>
              <Circle size={30} borderColor={colors.border} borderWidth={1}>
                <FontAwesome6 name="add" size={15} color={colors.textDark} />
              </Circle>
            </Pressable>
          )}
          {isEditable && (
            <Pressable
              style={{ marginLeft: 10 }}
              onPress={() => {
                onEditPress ? onEditPress() : {};
              }}>
              <Circle size={30} borderColor={colors.border} borderWidth={1}>
                <FontAwesome5 name="pen" size={13} color={colors.textDark} />
              </Circle>
            </Pressable>
          )}
        </View>
      </View>
      <View style={cardBodyStyle}>{children}</View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 5,
    flexDirection: 'column',
  },
  cardHeaderCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  cardHeader: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.textDark,
  },
  entityCount: { color: colors.primary },
  basicBodyStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  actionCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
