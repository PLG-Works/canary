import {unescape} from 'lodash';
import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  bookmarkedIcon,
  bookmarkIcon,
  commentIcon,
  likeIcon,
  ListIcon,
  ShareIcon,
  TwitterIcon,
  verifiedIcon,
} from '../../assets/common';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import useTweetCardData from './useTweetCardData';
import ImageCard from '../ImageCard';
import {getFormattedStat} from '../../utils/TextUtils';
import Image from 'react-native-fast-image';
import TwitterTextView from '../common/TwitterTextView';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {getDisplayDate} from '../../utils/TimeUtils';
import fonts from '../../constants/fonts';
import * as Animatable from 'react-native-animatable';

function TweetCard(props) {
  const {
    dataSource,
    isDisabled = false,
    style,
    textStyle,
    linkTextStyle,
    showBookmarked = false,
    onBookmarkPress,
  } = props;

  const {
    bCanShare,
    bHasMedia,
    bIsTweetBookmarked,
    fnOnAddToListPress,
    fnOnBookmarkButtonPress,
    fnOnCardPress,
    fnOnUserNamePress,
    fnOnSharePress,
    fnOnTwitterIconPress,
    fnOnLikePress,
  } = useTweetCardData(props);
  const localStyle = useStyleProcessor(styles, 'TweetCard');
  const {user, text, id, public_metrics, media, entities, created_at} =
    dataSource;

  const displayDate = useMemo(() => getDisplayDate(created_at), [created_at]);

  return (
    <Animatable.View animation="fadeIn">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={fnOnCardPress}
        style={style || localStyle.cardContainer}
        disabled={isDisabled}>
        <View style={localStyle.userProfileContainer}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={fnOnUserNamePress}
            style={localStyle.userNameView}>
            <Image
              source={{uri: user?.profile_image_url}}
              style={localStyle.userProfileImage}
            />
            <View style={localStyle.flexShrink}>
              <Text style={localStyle.nameText} numberOfLines={1}>
                {unescape(user?.name)}
              </Text>
              <View style={localStyle.flexRow}>
                <Text style={localStyle.userNameText} numberOfLines={1}>
                  @{unescape(user?.username)}
                </Text>
                {user?.verified ? (
                  <Image
                    source={verifiedIcon}
                    style={localStyle.verifiedIcon}
                  />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
          <View style={localStyle.timeView}>
            <Text style={localStyle.displayDateText}>{displayDate}</Text>
          </View>
        </View>
        <View style={localStyle.tweetDetailContainer}>
          <TwitterTextView
            style={textStyle || localStyle.tweetText}
            linkStyle={linkTextStyle}
            hasMedia={bHasMedia}
            urls={entities?.urls}>
            {unescape(text)}
          </TwitterTextView>
          {bHasMedia ? <ImageCard mediaArray={media} tweetId={id} /> : null}
          <View style={localStyle.likeCommentStrip}>
            <TouchableOpacity
              style={localStyle.flexRow}
              onPress={fnOnLikePress}>
              <Image source={likeIcon} style={localStyle.iconStyle} />
              <Text style={localStyle.publicMetricText}>
                {public_metrics?.like_count === 0
                  ? 0
                  : getFormattedStat(public_metrics?.like_count)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={localStyle.flexRow}
              onPress={fnOnLikePress}>
              {public_metrics?.reply_count > 0 ? (
                <View style={localStyle.flexRow}>
                  <Image source={commentIcon} style={localStyle.iconStyle} />
                  <Text style={localStyle.publicMetricText}>
                    {getFormattedStat(public_metrics?.reply_count)}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <View style={localStyle.optionsView}>
              <TouchableOpacity
                onPress={fnOnSharePress}
                style={localStyle.shareIconContainer}
                hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
                <Image source={ShareIcon} style={localStyle.shareIconStyle} />
              </TouchableOpacity>
              {bCanShare ? (
                <TouchableOpacity
                  onPress={fnOnTwitterIconPress}
                  style={localStyle.shareIconContainer}
                  hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
                  <Image
                    source={TwitterIcon}
                    style={localStyle.twitterIconStyle}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={
                  onBookmarkPress
                    ? () => {
                        onBookmarkPress(id);
                      }
                    : fnOnBookmarkButtonPress
                }
                hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
                <Image
                  source={
                    bIsTweetBookmarked || showBookmarked
                      ? bookmarkedIcon
                      : bookmarkIcon
                  }
                  style={localStyle.bookmarkIconStyle}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={fnOnAddToListPress}
                hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
                <Image source={ListIcon} style={localStyle.listIconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = {
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.BlackPearl20,
    marginHorizontal: layoutPtToPx(8),
    marginBottom: layoutPtToPx(12),
    borderRadius: layoutPtToPx(8),
    padding: layoutPtToPx(12),
    flex: 1,
  },
  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  userProfileImage: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    marginRight: layoutPtToPx(8),
    borderRadius: layoutPtToPx(20),
  },
  userNameView: {
    flexShrink: 1,
    flexDirection: 'row',
    paddingRight: layoutPtToPx(10),
  },
  timeView: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  tweetDetailContainer: {
    flex: 1,
    marginTop: layoutPtToPx(8),
    justifyContent: 'center',
  },
  tweetText: {
    fontFamily: fonts.InterRegular,
    marginBottom: 10,
    color: colors.BlackPearl,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexShrink: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  displayDateText: {
    fontFamily: fonts.InterRegular,
    flexGrow: 1,
    color: colors.BlackPearl50,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(16),
    marginTop: layoutPtToPx(8),
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
  likeCommentStrip: {
    flexDirection: 'row',
    paddingTop: layoutPtToPx(10),
  },
  iconStyle: {
    height: layoutPtToPx(15),
    width: layoutPtToPx(17),
    marginRight: layoutPtToPx(4),
    marginTop: 1,
  },
  bookmarkIconStyle: {
    height: layoutPtToPx(20),
    marginHorizontal: layoutPtToPx(10),
    width: layoutPtToPx(15),
  },
  shareIconContainer: {
    justifyContent: 'center',
  },
  shareIconStyle: {
    height: layoutPtToPx(17),
    aspectRatio: 1,
    marginHorizontal: layoutPtToPx(10),
  },
  twitterIconStyle: {
    height: layoutPtToPx(20),
    aspectRatio: 1,
    marginHorizontal: layoutPtToPx(10),
  },
  listIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(15),
    marginHorizontal: layoutPtToPx(10),
  },
  publicMetricText: {
    color: colors.Black,
    marginRight: layoutPtToPx(12),
  },
  optionsView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
};

export default React.memo(TweetCard);
