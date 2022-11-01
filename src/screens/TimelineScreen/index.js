import React, {useCallback, useMemo, useRef} from 'react';
import {Image, Text, View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {Canary, SettingsIcon} from '../../assets/common';
import useTimelineScreenData from './useTimelineScreenData';
import Header from '../../components/common/Header';
import colors, {getColorWithOpacity} from '../../constants/colors';
import TimelineList from '../../components/TimelineList';
import fonts from '../../constants/fonts';
import useTabListener from '../../hooks/useTabListener';
import {isTablet} from 'react-native-device-info';
import {useOrientationState} from '../../hooks/useOrientation';
import SearchScreenContent from '../../components/SearchScreenContent';
import {TouchableOpacity} from '@plgworks/applogger';

function TimelineScreen(props) {
  const localStyle = useStyleProcessor(styles, 'TimelineScreen');

  const {isPortrait} = useOrientationState();
  const isTabletLandscape = useMemo(
    () => isTablet() && !isPortrait,
    [isPortrait],
  );

  const {fnOnSettingsPress, bRefreshing} = useTimelineScreenData();
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  return (
    <View style={localStyle.container}>
      <View style={localStyle.flexRow}>
        <View style={localStyle.listComponent}>
          <Header
            testID={'timeline_screen'}
            enableRightButton={true}
            onRightButtonClick={fnOnSettingsPress}
            rightButtonImage={SettingsIcon}
            text={
              <TouchableOpacity
                testID="canary_title_home_screen"
                activeOpacity={0.9}
                onPress={scrollToTop}
                style={localStyle.flex}>
                <View style={localStyle.flexRow}>
                  <Image source={Canary} style={localStyle.iconStyle} />
                  <Text style={localStyle.appNameText}>Canary</Text>
                </View>
                <Text style={localStyle.headerDescriptionText}>
                  Showing tweets from the last 7 days
                </Text>
              </TouchableOpacity>
            }
          />

          <TimelineList
            testID="timeline_screen"
            listRef={scrollRef}
            refreshData={bRefreshing}
            reloadData={false}
            shouldShowSearchContent={true}
          />
        </View>
        {isTabletLandscape ? <SearchScreenContent /> : null}
      </View>
    </View>
  );
}
export default React.memo(TimelineScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  listComponent: {
    width: '100%',
    tablet: {
      landscape: {
        width: '70%',
        borderRightWidth: 1,
        borderRightColor: colors.BlackPearl20,
      },
    },
  },
  flex: {
    flex: 1,
  },
  iconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
  appNameText: {
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    marginLeft: layoutPtToPx(4),
  },
  headerDescriptionText: {
    color: getColorWithOpacity(colors.BlackPearl, 0.7),
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(10),
    lineHeight: layoutPtToPx(12),
    marginLeft: layoutPtToPx(10),
    marginTop: layoutPtToPx(8),
    textAlign: 'center',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
