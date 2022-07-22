import React, {useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TransitionPresets} from '@react-navigation/stack';
import ScreenName from '../constants/ScreenName';
import TimelineScreen from '../screens/TimelineScreen';
import CollectionScreen from '../screens/CollectionScreen';
import SettingScreen from '../screens/SettingScreen';
import {Image} from 'react-native';
import {HomeIcon, CollectionsIcon} from '../assets/common';
import {layoutPtToPx} from '../utils/responsiveUI';
import {useStyleProcessor} from '../hooks/useStyleProcessor';
import colors from '../utils/colors';
import PreferenceScreen from '../screens/PreferenceScreen';
import CollectionTweetScreen from '../screens/CollectionTweetScreen';
import ImageViewScreen from '../screens/ImageViewScreen';
import ThreadScreen from '../screens/ThreadScreen';

// TODO: Please correct he screen names.
const Navigation = props => {
  const localStyle = useStyleProcessor(styles, 'Navigation');

  const Tab = createBottomTabNavigator();
  const TimelineStack = createSharedElementStackNavigator();
  const CollectionStack = createSharedElementStackNavigator();

  const {bottom} = useSafeAreaInsets();

  function TimelineTabStack() {
    return (
      <TimelineStack.Navigator detachInactiveScreens={true}>
        <TimelineStack.Screen
          name={ScreenName.TimelineScreen}
          component={TimelineScreen}
          options={{
            headerShown: false,
            headerMode: 'none',
            detachPreviousScreen: true,
          }}
        />
        <TimelineStack.Screen
          name={ScreenName.SettingScreen}
          component={SettingScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <TimelineStack.Screen
          name={ScreenName.PreferenceScreen}
          component={PreferenceScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <TimelineStack.Screen
          name={ScreenName.ImageViewScreen}
          component={ImageViewScreen}
          options={{
            detachPreviousScreen: false,
            headerShown: false,
            gestureEnabled: false,
            presentation: 'card',
            cardOverlayEnabled: false,
            cardStyle: {backgroundColor: 'transparent'},
            transitionSpec: {
              open: {animation: 'spring'},
              close: {animation: 'spring'},
            },
            cardStyleInterpolator: ({current}) => {
              return {
                cardStyle: {
                  opacity: current.progress,
                },
              };
            },
          }}
        />
        <TimelineStack.Screen
          name={ScreenName.ThreadScreen}
          component={ThreadScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </TimelineStack.Navigator>
    );
  }

  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);

    switch (routeName) {
      case ScreenName.PreferenceScreen:
      case ScreenName.ThreadScreen:
      case ScreenName.ImageViewScreen:
        return false;
      default:
        return true;
    }
  };

  const bottomStack = useCallback(bottomHeight => {
    const tabbarStyle = {height: 40 + bottomHeight};
    return (
      <Tab.Navigator
        detachInactiveScreens={true}
        initialRouteName={ScreenName.HomeScreen}
        screenOptions={{tabBarHideOnKeyboard: true, tabBarShowLabel: false}}>
        <Tab.Screen
          options={({route}) => {
            return {
              tabBarIcon: ({focused}) => (
                <Image
                  source={HomeIcon}
                  style={[
                    localStyle.bottomTabIcons,
                    {tintColor: focused ? colors.DodgerBlue : colors.Black},
                  ]}
                />
              ),

              tabBarStyle: getTabBarVisibility(route)
                ? tabbarStyle
                : {display: 'none'},
              headerShown: false,
            };
          }}
          name={ScreenName.TimelineTab}
          component={TimelineTabStack}
        />
        <Tab.Screen
          options={({route}) => {
            return {
              tabBarIcon: ({focused}) => (
                <Image
                  source={CollectionsIcon}
                  style={[
                    localStyle.bottomTabIcons,
                    {tintColor: focused ? colors.DodgerBlue : colors.Black},
                  ]}
                />
              ),
              tabBarStyle: getTabBarVisibility(route)
                ? tabbarStyle
                : {display: 'none'},
              headerShown: false,
              lazy: false,
            };
          }}
          name={ScreenName.CollectionTab}
          title={'Collection'}
          component={CollectionTabStack}
        />
      </Tab.Navigator>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function CollectionTabStack() {
    return (
      <CollectionStack.Navigator detachInactiveScreens={true}>
        <CollectionStack.Screen
          name={ScreenName.CollectionScreen}
          component={CollectionScreen}
          options={{
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
          }}
        />
        <CollectionStack.Screen
          name={ScreenName.CollectionTweetScreen}
          component={CollectionTweetScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />

        <CollectionStack.Screen
          name={ScreenName.ImageViewScreen}
          component={ImageViewScreen}
          options={{
            detachPreviousScreen: false,
            headerShown: false,
            gestureEnabled: false,
            presentation: 'card',
            cardOverlayEnabled: false,
            cardStyle: {backgroundColor: 'transparent'},
            transitionSpec: {
              open: {animation: 'spring'},
              close: {animation: 'spring'},
            },
            cardStyleInterpolator: ({current}) => {
              return {
                cardStyle: {
                  opacity: current.progress,
                },
              };
            },
          }}
        />

        <CollectionStack.Screen
          name={ScreenName.ThreadScreen}
          component={ThreadScreen}
          options={{
            gestureEnabled: true,
            headerShown: false,
            tabBarVisible: false,
            detachPreviousScreen: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </CollectionStack.Navigator>
    );
  }

  return bottomStack(bottom);
};

export default Navigation;

const styles = {
  bottomTabIcons: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
  },
};
