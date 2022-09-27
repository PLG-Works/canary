import {StackActions, useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {Linking, Share} from 'react-native';
import {replace} from '../../utils/Strings';
import {checkIsTweetBookmarked} from '../utils/ViewData';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import Cache from '../../services/Cache';
import {Constants} from '../../constants/Constants';
import {getExportURL} from '../../services/ShareHelper';

function useTweetCardData(props) {
  const {dataSource, shouldShowSearchContent} = props;
  const {user, id, media} = dataSource;
  const [isTweetBookmarked, setIsTweetBookmarked] = useState(
    checkIsTweetBookmarked(id),
  );

  const tweetUrl = useMemo(() => {
    const url = replace(
      'https://twitter.com/{{userName}}/status/{{tweetId}}/',
      {userName: user?.username, tweetId: id},
    );
    return url;
  }, [id, user]);

  const navigation = useNavigation();

  const onBookmarkButtonPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToCollectionModal, {
      tweetId: id,
      onAddToCollectionSuccess: () => {
        setIsTweetBookmarked(true);
      },
      onRemoveFromAllCollectionSuccess: () => {
        setIsTweetBookmarked(false);
      },
    });
  }, [id]);

  const onAddToListSuccess = useCallback(() => {
    LocalEvent.emit(EventTypes.UpdateList);
  }, []);

  const onAddToListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddToListModal, {
      userName: user.username,
      onAddToListSuccess: onAddToListSuccess,
    });
  }, [onAddToListSuccess, user]);

  const hasMedia = useMemo(() => {
    return media && media?.length !== 0;
  }, [media]);

  const onCardPress = useCallback(() => {
    dataSource.isBookmarked = checkIsTweetBookmarked(id);
    navigation.dispatch(
      StackActions.push(ScreenName.ThreadScreen, {
        tweetData: dataSource,
        shouldShowSearchContent: shouldShowSearchContent,
      }),
    );
  }, [dataSource, id, navigation, shouldShowSearchContent]);

  const onUserNamePress = useCallback(
    ({userName = null}) => {
      navigation.push(ScreenName.UserProfileScreen, {
        userName: userName ? userName : dataSource.user?.username,
      });
    },
    [dataSource, navigation],
  );

  const onTweetBookmarked = useCallback(newValue => {
    setIsTweetBookmarked(newValue);
  }, []);

  const onSharePress = useCallback(() => {
    const exportData = {
      pn: Constants.PageName.Thread,
      data: id,
    };
    getExportURL(exportData)
      .then(url => {
        Share.share({
          message: `Check out this tweet!\n\n${url}\n\nSent from Canary app`,
        });
      })
      .catch(() => {
        Share.share({
          message: `Check out this tweet!\n\n${tweetUrl}\n\nSent from Canary app`,
        });
      });
  }, [id, tweetUrl]);

  const onLikePress = useCallback(() => {
    if (!getIsRedirectModalHidden()) {
      LocalEvent.emit(EventTypes.ShowRedirectConfirmationModal, {tweetUrl});
    } else {
      Linking.openURL(tweetUrl);
    }
  }, [getIsRedirectModalHidden, tweetUrl]);

  const onTwitterIconPress = useCallback(() => {
    if (!getIsRedirectModalHidden()) {
      LocalEvent.emit(EventTypes.ShowRedirectConfirmationModal, {tweetUrl});
    } else {
      Linking.openURL(tweetUrl);
    }
  }, [getIsRedirectModalHidden, tweetUrl]);

  const getIsRedirectModalHidden = useCallback(() => {
    const savedValue = Cache.getValue(CacheKey.IsRedirectModalHidden);
    if (savedValue === undefined || savedValue === null) {
      return false;
    }

    return !!JSON.parse(savedValue);
  }, []);

  return {
    bCanShare: !!tweetUrl,
    bHasMedia: hasMedia,
    bIsTweetBookmarked: isTweetBookmarked,
    fnOnAddToListPress: onAddToListPress,
    fnOnBookmarkButtonPress: onBookmarkButtonPress,
    fnOnCardPress: onCardPress,
    fnOnUserNamePress: onUserNamePress,
    fnSetIsTweetBookmarked: onTweetBookmarked,
    fnOnLikePress: onLikePress,
    fnOnTwitterIconPress: onTwitterIconPress,
    fnOnSharePress: onSharePress,
  };
}

export default useTweetCardData;
