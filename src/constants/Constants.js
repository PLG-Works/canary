import {StoreKeys} from '../services/AsyncStorage/StoreConstants';

export const Constants = {
  PlgWorksLink: 'https://www.plgworks.com',
  GoogleDriveLink:
    'https://drive.google.com/drive/folders/1OCA8czAIVEaGfU-F6EUL8fMwdnRerKdP?usp=sharing',
  DeepLinkUrl: 'https://plgworkscanary.page.link',
  FirebaseDatabaseUrl:
    'https://canary-8ff4c-default-rtdb.us-central1.firebasedatabase.app',
  FirebaseDatabasePath: '/users/',
  ApiModes: {
    //Verified with relevency with context
    VerifiedRelevent: 'verified_relevent',
    //Verified with recency with context
    VerifiedRecent: 'verified_recent',
    //All user with relevency with context
    AllUsersRelevent: 'all_users_relevent',
    //All Tweets with relevency without context
    AllResults: 'all_results',
  },
  CardTypes: {
    ShareCard: 'share_card',
    TweetCard: 'tweet_card',
  },
  SortOrder: {
    Relevancy: 'relevancy',
    Recency: 'recency',
  },
  PageName: {
    Archive: 'archive',
    List: 'list',
    Thread: 'thread',
  },
  ConfirmDeleteModalType: {
    Archive: 'confirm_delete_modal_type_archive',
    List: 'confirm_delete_modal_type_list',
  },
  WorldWideWoeidData: {
    country: '',
    countryCode: null,
    name: 'Worldwide',
    parentid: 0,
    placeType: {code: 19, name: 'Supername'},
    url: 'http://where.yahooapis.com/v1/place/1',
    woeid: 1,
  },
  Encryption: {salt: 'plg_canary', cost: 5000, length: 256},
  KeysIgnoredForBackup: [
    StoreKeys.BackupPassword,
    StoreKeys.IsAppReloaded,
    StoreKeys.DeviceCanaryId,
  ],
};
