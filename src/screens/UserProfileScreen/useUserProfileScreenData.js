import {useCallback, useEffect, useRef, useState} from 'react';
import TwitterAPI from '../../api/helpers/TwitterAPI';
import {Constants} from '../../constants/Constants';
import SearchResultListDataSource from '../SearchResultScreen/SearchResultListDataSource';

function useUserProfileScreenData(userName) {
  const listDataSource = useRef(null);
  const userDataRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  //   const [userData, setUserData] = useState(false);

  if (listDataSource.current === null) {
    listDataSource.current = new SearchResultListDataSource(
      `from:${userName}`,
      Constants.SortOrder.Recency,
    );
  }

  useEffect(() => {
    setIsLoading(true);
    TwitterAPI.getUserByUserName(userName).then(res => {
      userDataRef.current = res?.data?.data;
    });
  }, [userName]);

  const onDataAvailable = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    bIsLoading: isLoading,
    oUserData: userDataRef.current,
    searchResultListDataSource: listDataSource.current,
    fnOnDataAvailable: onDataAvailable,
  };
}
export default useUserProfileScreenData;
