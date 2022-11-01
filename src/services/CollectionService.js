import {StoreKeys} from './AsyncStorage/StoreConstants';
import Store from './AsyncStorage';
import uuid from 'react-native-uuid';
import Cache from './Cache';
import {CacheKey} from './Cache/CacheStoreConstants';
import {getRandomColorCombination} from '../utils/RandomColorUtil';
import {find} from 'lodash';
import {isEmpty} from 'lodash-es';
import {compareFunction} from '../utils/Strings';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import {getExportURL} from './ShareHelper';
import {Constants} from '../constants/Constants';

const COLLECTION_TWEET_LIMIT = 25;

class CollectionService {
  constructor() {
    this.collections = {};
  }

  async removeAllCollections() {
    await Store.removeItem(StoreKeys.CollectionsList);
  }

  async addCollection(collectionName, tweetIdArray) {
    return new Promise((resolve, reject) => {
      const _collectionName = collectionName.trim();
      if (isEmpty(_collectionName)) {
        return reject('Please enter a valid name');
      }
      Store.get(StoreKeys.CollectionsList).then(list => {
        const colorCombination = getRandomColorCombination();
        if (isEmpty(JSON.parse(list))) {
          const id = uuid.v4();
          var collectionObj = {};
          collectionObj[id] = {
            id: id,
            name: _collectionName,
            tweetIds: tweetIdArray || [],
            colorScheme: colorCombination,
          };

          this.collections = collectionObj;
          var bookmarkedTweets = this.bookmarkTweets(tweetIdArray, id);
          Store.set(StoreKeys.CollectionsList, collectionObj)
            .then(() => {
              this.updateBookmarkedTweetsInCacheAndStore(bookmarkedTweets);
              return resolve({collectionId: id});
            })
            .catch(() => {
              return reject('Could not add archive. Please try again');
            });
        } else {
          var _list = JSON.parse(list);
          const newId = uuid.v4();

          if (find(_list, {name: _collectionName})) {
            return reject('Archive name already exists.');
          }

          const newCollection = {};
          newCollection[newId] = {
            id: newId,
            name: _collectionName,
            tweetIds: tweetIdArray || [],
            colorScheme: colorCombination,
          };

          _list = {..._list, ...newCollection};
          this.collections = _list;
          var bookmarkedTweets = this.bookmarkTweets(tweetIdArray, newId);

          Store.set(StoreKeys.CollectionsList, _list)
            .then(() => {
              this.updateBookmarkedTweetsInCacheAndStore(bookmarkedTweets);
              return resolve({collectionId: newId});
            })
            .catch(() => {
              return reject('Could not add archive. Please try again');
            });
        }
      });
    });
  }

  async editCollection(collection) {
    return new Promise((resolve, reject) => {
      const {id, name} = collection;
      const collectionName = name.trim();
      if (find(this.collections, {name: collectionName})) {
        return reject('Archive name already exists.');
      }
      const _collection = this.collections[id];
      _collection.name = collectionName;
      this.collections[id] = _collection;
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          return resolve();
        })
        .catch(() => {
          return reject('Could not update archive. Please try again!');
        });
    });
  }

  async importMultipleCollections(collections) {
    for (const collection of collections) {
      await this.importCollection(collection);
    }
  }
  async removeMultipleCollection(collectionIds) {
    for (const collectionId of collectionIds) {
      await this.removeCollection(collectionId);
    }
  }

  async importCollection(collection) {
    return new Promise((resolve, reject) => {
      const newCollectionName = collection.name + ' ★';
      this.addCollection(newCollectionName, collection.tweetIds)
        .then(res => {
          return resolve(res);
        })
        .catch(err => {
          // TODO: move error to a common place
          if (err === 'Archive name already exists.') {
            this.importCollection({
              name: newCollectionName,
              tweetIds: collection.tweetIds,
            }).then(res => {
              return resolve(res);
            });
          } else {
            return reject(err);
          }
        });
    });
  }

  async getMultipleCollectionDetails(collectionIds = []) {
    return new Promise((resolve, reject) => {
      let collectionDataArray = [];
      collectionIds.forEach(collectionId => {
        this.getCollectionDetails(collectionId)
          .then(collection => {
            collectionDataArray.push({
              name: collection?.name,
              tweetIds: collection?.tweetIds,
            });
            if (collectionDataArray.length === collectionIds.length) {
              return resolve(collectionDataArray);
            }
          })
          .catch(() => {
            return reject();
          });
      });
    });
  }

  async exportCollection(collectionIds = []) {
    return new Promise((resolve, reject) => {
      this.getMultipleCollectionDetails(collectionIds)
        .then(collectionDataArray => {
          const exportData = {
            pn: Constants.PageName.Archive,
            data: collectionDataArray,
          };
          getExportURL(exportData)
            .then(url => {
              return resolve(url);
            })
            .catch(() => {
              return reject();
              // TODO: do nothing
            });
        })
        .catch(() => {
          // TODO: do nothing
          return reject();
        });
    });
  }

  async getCollectionDetails(collectionId) {
    return new Promise((resolve, reject) => {
      if (this.collections && Object.keys(this.collections).length === 0) {
        this.getAllCollections()
          .then(collectionList => {
            return resolve(collectionList[collectionId]);
          })
          .catch(() => {
            return reject();
          });
      } else {
        return resolve(this.collections[collectionId]);
      }
    });
  }

  async getAllCollections() {
    return new Promise((resolve, reject) => {
      Store.get(StoreKeys.CollectionsList)
        .then(list => {
          var jsonList = {};
          if (list !== null) {
            jsonList = JSON.parse(list);
          }
          const listArray = Object.entries(jsonList);
          listArray.sort((collection1, collection2) => {
            return compareFunction(collection1[1].name, collection2[1].name);
          });

          this.collections = Object.fromEntries(listArray);
          return resolve(this.collections);
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async updateBookmarkedTweetsInCacheAndStore(bookmarkedTweets) {
    return new Promise((resolve, reject) => {
      Cache.setValue(CacheKey.BookmarkedTweetsList, bookmarkedTweets);
      Store.set(StoreKeys.BookmarkedTweetsList, bookmarkedTweets)
        .then(() => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  bookmarkTweets(tweetIdArray = [], collectionId) {
    var bookmarkedTweets = Cache.getValue(CacheKey.BookmarkedTweetsList) || {};
    var newArray = [];
    tweetIdArray.map(tweetId => {
      if (bookmarkedTweets[tweetId]) {
        // Add same tweet to multiple collections case
        newArray = bookmarkedTweets[tweetId];
      }
      // TODO : check for existing collection id
      newArray.push(collectionId);
      bookmarkedTweets[tweetId] = newArray;
    });
    return bookmarkedTweets;
  }

  async _addTweet(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      if (
        this.collections?.[collectionId]?.tweetIds.length >=
        COLLECTION_TWEET_LIMIT
      ) {
        return reject(
          'This archive is full. Try adding it to a different archive or create a new one.',
        );
      }

      this.collections?.[collectionId]?.tweetIds?.push?.(tweetId);

      var bookmarkedTweets = this.bookmarkTweets([tweetId], collectionId);
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          this.updateBookmarkedTweetsInCacheAndStore(bookmarkedTweets)
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject();
            });
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async addTweetToCollection(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      if (this.collections && Object.keys(this.collections).length === 0) {
        // If local copy is not populated, populate and then add tweet
        this.getAllCollections()
          .then(() => {
            this._addTweet(collectionId, tweetId)
              .then(() => {
                return resolve();
              })
              .catch(error => {
                return reject(error);
              });
          })
          .catch(() => {
            return reject();
          });
      } else {
        // If local copy is populated, add tweet
        this._addTweet(collectionId, tweetId)
          .then(() => {
            return resolve();
          })
          .catch(error => {
            return reject(error);
          });
      }
    });
  }

  async removeCollection(collectionId) {
    return new Promise((resolve, reject) => {
      const tweetIdsOfThisCollection = this.collections[collectionId].tweetIds;
      const bookmarkedIds = Cache.getValue(CacheKey.BookmarkedTweetsList) || {};
      delete this.collections[collectionId];
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          tweetIdsOfThisCollection.forEach(tweetId => {
            if (bookmarkedIds[tweetId].length === 1) {
              delete bookmarkedIds[tweetId];
            } else {
              const indexToRemove =
                bookmarkedIds[tweetId].indexOf(collectionId);
              bookmarkedIds[tweetId].splice(indexToRemove, 1);
            }
          });
          this.updateBookmarkedTweetsInCacheAndStore(bookmarkedIds)
            .then(() => {
              return resolve();
            })
            .catch(() => {});
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  async removeTweetFromCollection(collectionId, tweetId) {
    return new Promise((resolve, reject) => {
      const bookmarkedIds = Cache.getValue(CacheKey.BookmarkedTweetsList) || {};
      const collectionIds = bookmarkedIds[tweetId];
      collectionIds.splice(collectionIds.indexOf(collectionId), 1);
      if (collectionIds.length === 0) {
        delete bookmarkedIds[tweetId];
      } else {
        bookmarkedIds[tweetId] = collectionIds;
      }
      const tweetIds = this.collections[collectionId]?.tweetIds;
      const index = tweetIds.indexOf(tweetId);
      if (index > -1) {
        tweetIds.splice(index, 1);
      }
      this.collections[collectionId].tweetIds = tweetIds;
      Store.set(StoreKeys.CollectionsList, this.collections)
        .then(() => {
          this.updateBookmarkedTweetsInCacheAndStore(bookmarkedIds)
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject();
            });
          return resolve();
        })
        .catch(() => {
          return reject('Unable to remove tweet from archive');
        });
    });
  }

  async isCollectionEmpty(collectionId) {
    return new Promise((resolve, reject) => {
      this.getCollectionDetails(collectionId)
        .then(collectionData => {
          if (collectionData.tweetIds.length === 0) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  isTweetRemoveFromAllCollections(tweetId) {
    const bookmarkedTweets = Cache.getValue(CacheKey.BookmarkedTweetsList);
    if (bookmarkedTweets) {
      const isPresent = bookmarkedTweets?.hasOwnProperty(tweetId);
      return !isPresent;
    }
    return true;
  }

  handleTweetError(collectionId, errors) {
    errors.forEach((error, index) => {
      if (error?.title === 'Not Found Error' && error?.parameter === 'ids') {
        const tweetId = error?.value;
        if (tweetId) {
          this.removeTweetFromCollection(collectionId, tweetId).then(() => {
            if (index === errors?.length - 1) {
              LocalEvent.emit(EventTypes.UpdateCollection);
            }
          });
        }
      }
    });
  }
}

let _collectionService = null;
const collectionService = () => {
  if (!_collectionService) {
    _collectionService = new CollectionService();
  }
  return _collectionService;
};

export {collectionService};
