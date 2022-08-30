import React, {Component} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

import {RectButton} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (_progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });
    const {enabled} = this.props;
    return enabled ? (
      <RectButton
        style={styles.leftAction}
        onPress={this.close}
        key={this.props?.id}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{translateX: trans}],
            },
          ]}>
          Archive
        </Animated.Text>
      </RectButton>
    ) : null;
  };

  renderRightAction = (text, color, x, progress, onPress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const {enabled, textStyle} = this.props;

    return enabled ? (
      <Animated.View
        style={{flex: 1, transform: [{translateX: trans}]}}
        key={`this.props?.id-${text}`}>
        <RectButton
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={onPress}>
          <Text style={textStyle || styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    ) : null;
  };

  renderRightActions = (progress, _dragAnimatedValue) => {
    const {rightActionsArray} = this.props;
    let index = rightActionsArray.length + 1;
    return (
      <View
        style={{width: rightActionsArray.length * 64, flexDirection: 'row'}}>
        {rightActionsArray.map((val, ind) => {
          index -= 1;
          return this.renderRightAction(
            val?.actionName,
            val?.color,
            64 * index,
            progress,
            rightActionsArray[ind]?.onPress,
          );
        })}
      </View>
    );
  };

  swipeableRow;

  updateRef = ref => {
    this.swipeableRow = ref;
  };
  close = () => {
    this.swipeableRow?.close();
  };

  render() {
    const {
      id,
      children,
      // using as state update for enabling swipe
      enabled,
      // To disable entire swipe action
      disableSwipeInteraction,
      shouldRenderLeftAction,
      shouldRenderRightAction,
      onSwipeableOpen,
      onSwipeableClose,
    } = this.props;

    if (!enabled && !disableSwipeInteraction) {
      this.close();
    }

    return (
      <Swipeable
        key={id}
        overshootLeft={false}
        overshootRight={false}
        enabled={enabled && !disableSwipeInteraction}
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30}
        rightThreshold={40}
        renderLeftActions={
          shouldRenderLeftAction ? this.renderLeftActions : null
        }
        renderRightActions={
          shouldRenderRightAction ? this.renderRightActions : null
        }
        onSwipeableOpen={onSwipeableOpen}
        onSwipeableClose={onSwipeableClose}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
