import {unescape} from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {verifiedIcon} from '../../../assets/common';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import {getFormattedStat} from '../../../utils/TextUtils';
import TwitterTextView from '../TwitterTextView';

function UserCard(props) {
  const {style, cardStyle, userData, shouldDisablePress = true} = props;
  const localStyle = useStyleProcessor(styles, 'UserCard');
  return (
    <View style={style || localStyle.container}>
      <View style={cardStyle || localStyle.cardContainer}>
        <View>
          <Image
            source={{uri: userData?.profile_image_url}}
            style={localStyle.userProfileImage}
          />
          <View style={localStyle.nameContainer}>
            <Text style={localStyle.nameText} numberOfLines={1}>
              {unescape(userData?.name)}
            </Text>
            <View style={localStyle.userNameContainer}>
              <Text style={localStyle.userNameText} numberOfLines={1}>
                @{unescape(userData?.username)}
              </Text>
              {userData?.verified ? (
                <Image source={verifiedIcon} style={localStyle.verifiedIcon} />
              ) : null}
            </View>
          </View>
        </View>
        <View style={localStyle.publicMetricContainer}>
          <View style={localStyle.metricBox}>
            <Text style={localStyle.metricCountText}>
              {getFormattedStat(userData?.public_metrics?.tweet_count)}
            </Text>
            <Text style={localStyle.metricNameText}>Tweets</Text>
          </View>
          <View style={localStyle.metricBox}>
            <Text style={localStyle.metricCountText}>
              {getFormattedStat(userData?.public_metrics?.followers_count)}
            </Text>
            <Text style={localStyle.metricNameText}>Followers</Text>
          </View>
          <View style={localStyle.metricBox}>
            <Text style={localStyle.metricCountText}>
              {getFormattedStat(userData?.public_metrics?.following_count)}
            </Text>
            <Text style={localStyle.metricNameText}>Following</Text>
          </View>
        </View>
        <TwitterTextView
          style={localStyle.descriptionText}
          linkStyle={localStyle.descriptionLinkText}
          isPressDisabled={shouldDisablePress}>
          {userData?.description}
        </TwitterTextView>
      </View>
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: layoutPtToPx(20),
    paddingBottom: layoutPtToPx(10),
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: getColorWithOpacity(colors.Black, 0.2),
    borderRadius: layoutPtToPx(6),
    padding: layoutPtToPx(12),
  },
  userProfileImage: {
    height: layoutPtToPx(48),
    width: layoutPtToPx(48),
    borderRadius: layoutPtToPx(24),
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layoutPtToPx(8),
  },
  nameContainer: {
    marginTop: layoutPtToPx(8),
    flexShrink: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(16),
    height: layoutPtToPx(24),
    flexShrink: 1,
    color: colors.BlackPearl,
  },
  verifiedIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(12),
    marginLeft: layoutPtToPx(2),
  },
  userNameText: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.Black,
  },
  publicMetricContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: 0,
    top: 17,
  },
  metricBox: {
    alignItems: 'center',
    paddingHorizontal: layoutPtToPx(12),
  },
  metricCountText: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(19),
    color: colors.Black,
  },
  metricNameText: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    color: colors.Black,
    marginTop: layoutPtToPx(2),
  },
  descriptionText: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.BlackPearl,
  },
  descriptionLinkText: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.GoldenTainoi,
  },
};

export default React.memo(UserCard);
