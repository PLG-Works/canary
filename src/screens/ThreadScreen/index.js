import {View} from 'react-native';
import React, {useRef} from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import TweetCard from '../../components/TweetCard';
import TimelineList from '../../components/TimelineList';
import ThreadTweetListDataSource from './ThreadTweetList/ThreadTweetListDataSource';
import Header from '../../components/common/Header';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

function ThreadScreen(props) {
  const {tweetData} = props?.route?.params;

  const localStyle = useStyleProcessor(styles, 'ThreadScreen');

  const listDataSource = useRef(null);
  if (listDataSource.current === null) {
    listDataSource.current = new ThreadTweetListDataSource({
      tweetId: tweetData.id,
      conversationId: tweetData.conversation_id,
      username: tweetData.user.username,
    });
  }

  //TODO: Implement pull to refresh.
  return (
    <View style={localStyle.container}>
      <Header enableBackButton={true} />
      <TimelineList
        reloadData={false}
        refreshData={false}
        timelineListDataSource={listDataSource.current}
        listHeaderComponent={
          <TweetCard
            dataSource={tweetData}
            isDisabled={true}
            style={localStyle.cardStyle}
            textStyle={localStyle.tweetText}
            linkTextStyle={localStyle.tweetLinkText}
          />
        }
      />
    </View>
  );
}

export default React.memo(ThreadScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  cardStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BlackPearl50,
    marginBottom: layoutPtToPx(12),
    padding: layoutPtToPx(12),
    flex: 1,
  },
  header: {
    marginHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tweetText: {
    fontFamily: fonts.InterMedium,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    marginBottom: 10,
    color: colors.BlackPearl,
  },
  tweetLinkText: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    color: colors.GoldenTainoi,
  },
};
