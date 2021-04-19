import React, {useRef, FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  I18nManager,
  GestureResponderEvent,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
});

export interface ScriptListItemInterface {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  handleDelete: () => void;
}

export const ScriptListItem: FC<ScriptListItemInterface> = ({
  title,
  onPress,
  handleDelete,
}) => {
  const swipeableRow = useRef<Swipeable>(null);

  const close = () => {
    swipeableRow.current?.close();
  };

  const renderRightAction = (progress: Animated.AnimatedInterpolation) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [70, 0],
    });
    const pressHandler = () => {
      handleDelete();
      close();
    };
    return (
      <View
        style={{
          width: 70,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
        <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
          <RectButton
            style={[styles.rightAction, {backgroundColor: '#dd2c00'}]}
            onPress={pressHandler}>
            <Text style={styles.actionText}>Delete</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightAction}>
      <TouchableOpacity onPress={onPress} style={styles.item}>
        <Text>{title}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};
