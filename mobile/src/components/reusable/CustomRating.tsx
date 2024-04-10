import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';

type Props = {
  starOption?: number;
  isDisplay?: boolean;
  starRating: number | undefined;
  setStarRating?: (rating: number) => void;
};
const CustomRating = ({
  starOption = 5,
  isDisplay = false,
  starRating = 0,
  setStarRating,
}: Props) => {
  const starOptionKeys = [...Array(starOption).keys()];
  const animatedButtonScale = new Animated.Value(1);
  const animatedScaleStyle = {
    transform: [{ scale: animatedButtonScale }],
  };
  return (
    <View style={styles.stars}>
      {starOptionKeys.map((option) => (
        <TouchableWithoutFeedback
          disabled={isDisplay}
          onPress={() => (setStarRating ? setStarRating(option + 1) : {})}
          key={option + 1}>
          <Animated.View style={animatedScaleStyle}>
            <MaterialIcons
              name={starRating >= option + 1 ? 'star' : 'star-border'}
              size={25}
              style={starRating >= option + 1 ? styles.starSelected : styles.starUnselected}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

export default CustomRating;

const styles = StyleSheet.create({
  stars: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  starUnselected: {
    color: colors.primary20,
  },
  starSelected: {
    color: colors.primary,
  },
});
