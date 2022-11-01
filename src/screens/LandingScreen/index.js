import React, {useCallback, useMemo} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import RoundedButton from '../../components/common/RoundedButton';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useLandingScreenData from './useLandingScreenData';
import {Pagination as PaginationDots} from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';
import Header from '../../components/common/Header';
import * as Animatable from 'react-native-animatable';
import {useAppStateListener} from '../../hooks/useAppStateListener';
import {rightArrowIcon} from '../../assets/common';

function LandingScreen(props) {
  const localStyle = useStyleProcessor(style, 'LandingScreen');

  const data = props?.route?.params;

  const isNotOnboardingScreen = !!data?.enableBackButton;

  const {
    aCarousalData,
    nActiveIndex,
    nWindowWidth,
    nWindowHeight,
    fnOnMomentumScrollEnd,
    fnSetFlatListRef,
    fnOnContinuePress,
    fnOnRestorePress,
  } = useLandingScreenData({isNotOnboardingScreen});

  const renderItemStyle = useMemo(() => {
    return [
      localStyle.renderItemContainer,
      {
        width: nWindowWidth,
        height: nWindowHeight / 2,
      },
    ];
  }, [localStyle.renderItemContainer, nWindowHeight, nWindowWidth]);

  const {isAppInBackground} = useAppStateListener();

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View key={`${index}_${isAppInBackground}`} style={renderItemStyle}>
          {item?.videoAsset ? (
            <Image source={item?.videoAsset} style={item?.animationStyle} />
          ) : item?.animationAsset ? (
            <LottieView
              autoPlay
              loop
              source={item?.animationAsset}
              style={item?.animationStyle}
            />
          ) : null}
        </View>
      );
    },
    [isAppInBackground, renderItemStyle],
  );

  const paginationOptionsObj = useMemo(
    () => ({
      dotColor: colors.GoldenTainoi,
      inactiveDotColor: getColorWithOpacity(colors.Black, 0.2),
      inactiveDotScale: 1,
      containerStyle: localStyle.paginationContainerStyle,
      dotStyle: localStyle.dotStyle,
      dotContainerStyle: localStyle.dotContainerStyle,
    }),
    [
      localStyle.dotContainerStyle,
      localStyle.dotStyle,
      localStyle.paginationContainerStyle,
    ],
  );

  const activeIndexData = useMemo(
    () => aCarousalData[nActiveIndex],
    [aCarousalData, nActiveIndex],
  );

  return (
    <Animatable.View style={localStyle.container} animation="slideInRight">
      {isNotOnboardingScreen ? (
        <Header testID={'onboarding_screen'} enableBackButton={true} />
      ) : null}
      <View style={localStyle.contentContainer}>
        <FlatList
          ref={fnSetFlatListRef}
          horizontal={true}
          pagingEnabled={true}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          data={aCarousalData}
          onMomentumScrollEnd={fnOnMomentumScrollEnd}
        />
        <PaginationDots
          {...paginationOptionsObj}
          dotsLength={aCarousalData?.length || 0}
          activeDotIndex={nActiveIndex}
          containerStyle={localStyle.paginationDotsContainerStyle}
        />
        <View style={localStyle.continueButtonContainer}>
          <Text
            style={localStyle.primaryText}
            adjustsFontSizeToFit
            numberOfLines={1}>
            {activeIndexData?.primaryText}
          </Text>

          <Text
            style={localStyle.secondaryText}
            adjustsFontSizeToFit
            numberOfLines={2}>
            {activeIndexData?.secondaryText}
          </Text>
          <RoundedButton
            testID={'landing_screen_continue'}
            style={localStyle.continueButton}
            textStyle={localStyle.continueButtonText}
            onPress={fnOnContinuePress}
            underlayColor={colors.GoldenTainoi80}
            rightImage={rightArrowIcon}
            rightImageStyle={localStyle.continueButtonIcon}
            text={isNotOnboardingScreen ? 'Got it !' : 'Get Started'}
          />
          {!isNotOnboardingScreen && nActiveIndex === 0 ? (
            <RoundedButton
              testID={'landing_screen_backup'}
              style={localStyle.secondaryRoundedButton}
              textStyle={localStyle.secondaryRoundedButtonText}
              onPress={fnOnRestorePress}
              underlayColor={getColorWithOpacity(colors.Black, 0.2)}
              text={'I am using Canary already'}
            />
          ) : (
            <View />
          )}
        </View>
      </View>
    </Animatable.View>
  );
}

const style = {
  container: {
    backgroundColor: colors.White,
    flex: 1,
  },
  renderItemContainer: {
    paddingHorizontal: layoutPtToPx(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonContainer: {
    paddingHorizontal: layoutPtToPx(10),
    tablet: {
      alignSelf: 'center',
      width: '60%',
      landscape: {
        width: '40%',
      },
    },
  },
  continueButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    marginTop: layoutPtToPx(10),
  },
  continueButtonText: {
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  continueButtonIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(16.5),
  },
  secondaryRoundedButton: {
    borderWidth: 1,
    borderColor: colors.BlackPearl,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    marginTop: layoutPtToPx(20),
  },
  secondaryRoundedButtonText: {
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  primaryText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(32),
    lineHeight: layoutPtToPx(40),
    textAlign: 'center',
    marginVertical: layoutPtToPx(20),
    color: colors.BlackPearl,
  },
  secondaryText: {
    fontFamily: fonts.InterMedium,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(24),
    textAlign: 'center',
    marginBottom: layoutPtToPx(16),
    color: colors.BlackPearl,
  },
  paginationContainerStyle: {
    paddingBottom: 0,
  },
  scrollViewContainer: {
    paddingRight: layoutPtToPx(20),
  },
  dotStyle: {
    marginRight: layoutPtToPx(8),
  },
  paginationDotsContainerStyle: {
    paddingVertical: layoutPtToPx(10),
  },
  dotContainerStyle: {
    marginHorizontal: 0,
  },
};
export default React.memo(LandingScreen);
