import TwitterAPI from '../../api/helpers/TwitterAPI';
import {Constants} from '../../constants/Constants';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

export function getTweetData(tweet, response) {
  const authorId = tweet.author_id;
  const mediaKeys = tweet?.attachments?.media_keys || [];
  var data = {...tweet, card_type: Constants.CardTypes.TweetCard};
  data.isBookmarked = checkIsTweetBookmarked(tweet.id);
  const userData = response?.data?.includes?.users;
  userData?.forEach(user => {
    if (user.id === authorId) {
      data = {...data, user};
      return;
    }
  });
  const mediaData = response.data?.includes?.media;
  if (mediaData && mediaKeys.length !== 0) {
    mediaData.forEach(media => {
      if (mediaKeys.includes(media.media_key)) {
        if (data.media) {
          data.media = [...data.media, media];
        } else {
          data = {...data, media: [media]};
        }
      }
    });
  }
  return data;
}

export function checkIsTweetBookmarked(tweetId) {
  if (!tweetId) {
    return false;
  }
  const bookmarkedTweetList = Cache.getValue(CacheKey.BookmarkedTweetsList);
  return bookmarkedTweetList
    ? bookmarkedTweetList?.hasOwnProperty(tweetId)
    : false;
}

export function showPromotion(cacheKey) {
  const promotion = Cache.getValue(cacheKey);
  if (promotion === undefined) {
    Cache.setValue(cacheKey, 0);
    return true;
  }
  if (promotion === false) {
    return false;
  }
  if (promotion % 5 === 0 && promotion <= 25) {
    return true;
  }
  return false;
}

export function getTweetDataFromId(tweetId) {
  return new Promise(resolve => {
    TwitterAPI.getSingleTweet(tweetId).then(res => {
      const tweetData = getTweetData(res?.data?.data, res);
      return resolve(tweetData);
    });
  });
}
