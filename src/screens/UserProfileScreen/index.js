import React, {useMemo} from 'react';
import {SafeAreaView} from 'react-native';
import Header from '../../components/common/Header';
import UserCard from '../../components/common/UserCard';
import TimelineList from '../../components/TimelineList';
import colors from '../../constants/colors';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {layoutPtToPx} from '../../utils/responsiveUI';
import useUserProfileScreenData from './useUserProfileScreenData';

function UserProfileScreen(props) {
  const {userName} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'UserProfileScreen');
  const {bIsLoading, oUserData, searchResultListDataSource, fnOnDataAvailable} =
    useUserProfileScreenData(userName);

  const listHeaderComponent = useMemo(() => {
    return (
      <UserCard
        userData={oUserData}
        cardStyle={localStyle.userCardStyle}
        style={localStyle.cardContainerStyle}
        shouldDisablePress={false}
      />
    );
  }, [localStyle.cardContainerStyle, localStyle.userCardStyle, oUserData]);

  return (
    <SafeAreaView style={localStyle.container}>
      <Header testId={'user_profile_screen'} enableBackButton={true} />
      <TimelineList
        testID="User Profile"
        style={localStyle.listStyle}
        timelineListDataSource={searchResultListDataSource}
        refreshData={bIsLoading}
        onDataAvailable={fnOnDataAvailable}
        listHeaderComponent={listHeaderComponent}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  loaderView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCardStyle: {},
  cardContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BlackPearl50,
    paddingHorizontal: layoutPtToPx(20),
    paddingBottom: layoutPtToPx(20),
    marginBottom: layoutPtToPx(10),
  },
  listStyle: {
    flex: 1,
  },
};
export default React.memo(UserProfileScreen);
