import React from 'react';
import {SafeAreaView} from 'react-native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/SearchBar';
import TimelineList from '../../components/TimelineList';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';
import useSearchResultScreenData from './useSearchResultScreenData';

function SearchResultScreen(props) {
  const {query} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'SearchResultScreen');
  const {
    bIsLoading,
    fnOnSearchPress,
    searchResultListDataSource,
    fnOnDataAvailable,
  } = useSearchResultScreenData({
    searchQuery: query,
  });
  return (
    <SafeAreaView style={localStyle.flex1}>
      <Header enableBackButton={true} text={'Search Result Screen'} />
      <SearchBar searchQuery={query} onSearchPressCallback={fnOnSearchPress} />
      <TimelineList
        style={localStyle.listStyle}
        timelineListDataSource={searchResultListDataSource}
        refreshData={bIsLoading}
        onDataAvailable={fnOnDataAvailable}
      />
    </SafeAreaView>
  );
}

const styles = {
  flex1: {flex: 1, backgroundColor: colors.White},
  listStyle: {flex: 1, marginTop: 10},
};
export default React.memo(SearchResultScreen);
