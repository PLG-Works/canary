import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Linking, Text} from 'react-native';
import ScreenName from '../../../constants/ScreenName';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import fonts from '../../../constants/fonts';
import {Constants} from '../../../constants/Constants';

const PATTERN_HASHTAG = /(#[^\s#]+|[^\s#]+#)(?=$|\s)/gi;
const PATTERN_MENTION = /(^|\s)(@[a-z\d-_]+)/gi;
const PATTERN_URL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const matchesWith = (str, pattern) => {
  let match = null;
  const arr = [];
  while ((match = pattern.exec(str)) != null) {
    arr.push([match, pattern]);
  }
  return arr;
};

const splitStringByMatches = (str, matches) => {
  const arr = [];
  let o = 0;

  matches.forEach(([match, pattern]) => {
    const {index} = {...match};
    const text = match[match.length - 1];
    arr.push([str.slice(o, index), null]);
    arr.push([str.slice(index, index + text.length + 1), pattern]);
    o = index + text.length + 1;
  });

  arr.push([str.slice(o, str.length), null]);

  return arr.filter(([s]) => s.length > 0);
};

function TwitterTextView({
  children = '',
  extractHashtags = true,
  hashtagStyle,
  extractMentions = true,
  mentionStyle,
  extractLinks = true,
  linkStyle,
  hasMedia = false,
  urls = [],
  style,
  isPressDisabled = false,
  ...extraProps
}) {
  const localStyle = useStyleProcessor(styles, 'TwitterTextView');
  const navigation = useNavigation();
  const onPressHashtag = useCallback(
    (e, str) => {
      navigation.push(ScreenName.SearchResultScreen, {query: str});
    },
    [navigation],
  );
  const onPressMention = useCallback(
    (e, str) => {
      const strArray = str.split('@');
      navigation.push(ScreenName.UserProfileScreen, {
        userName: strArray[1],
      });
    },
    [navigation],
  );
  const onPressLink = useCallback((e, url) => {
    Linking.openURL(url);
  }, []);

  const str = (typeof children === 'string' && children) || '';

  const patterns = [
    !!extractHashtags && PATTERN_HASHTAG,
    !!extractMentions && PATTERN_MENTION,
    !!extractLinks && PATTERN_URL,
  ].filter(e => !!e);

  const matches = []
    .concat(...patterns.map(pattern => matchesWith(str, pattern)))
    .filter(e => !!e)
    .sort(([a], [b]) => ({...a}.index - {...b}.index));

  const onPress = {
    [PATTERN_HASHTAG]: onPressHashtag,
    [PATTERN_MENTION]: onPressMention,
    [PATTERN_URL]: onPressLink,
  };

  const splitStringArray = splitStringByMatches(str, matches);
  if (hasMedia) {
    splitStringArray.pop();
  }

  const extractUrls = useCallback(
    text => {
      var urlObject = {};
      for (let index = 0; index < urls.length; index++) {
        const urlItem = urls[index];
        if (urlItem.url.trim() === text.trim()) {
          urlObject = {
            displayUrl: urlItem.display_url,
            expandedUrl: urlItem.expanded_url,
          };
          break;
        }
      }
      return urlObject;
    },
    [urls],
  );

  return (
    <Text {...extraProps}>
      {splitStringArray.map(([text, pattern], i) => {
        const isLink = pattern === PATTERN_URL;
        var displayText = text;
        var expandedLink = null;
        if (isLink) {
          const {displayUrl, expandedUrl} = extractUrls(text);
          displayText = displayUrl;
          expandedLink = expandedUrl;
        }
        const handle = onPress[pattern];
        return handle ? (
          <Text
            key={i}
            style={linkStyle || localStyle.linkStyle}
            disabled={isPressDisabled}
            onPress={e => {
              return handle(
                e,
                expandedLink ? expandedLink : displayText.trim(),
              );
            }}
            children={displayText}
          />
        ) : (
          <Text key={i} style={style || localStyle.textStyle}>
            {text}
          </Text>
        );
      })}
    </Text>
  );
}
const styles = {
  linkStyle: {
    fontFamily: fonts.InterSemiBold,
    color: colors.GoldenTainoi,
    lineHeight: layoutPtToPx(19),
    fontSize: fontPtToPx(14),
  },
  textStyle: {
    fontFamily: fonts.InterRegular,
    color: colors.Black,
    lineHeight: layoutPtToPx(19),
    fontSize: fontPtToPx(14),
  },
};

export default TwitterTextView;
