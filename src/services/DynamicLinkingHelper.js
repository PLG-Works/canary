import {getTweetDataFromId} from '../components/utils/ViewData';
import {Constants} from '../constants/Constants';
import ScreenName from '../constants/ScreenName';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import NavigationService from './NavigationService';
import {getImportData} from './ShareHelper';

export const handleDynamicUrl = url => {
  const importData = getImportData(url);
  if (importData?.error) {
    // TODO : handle
    return importData?.message;
  }
  const {pn: pageName, data} = importData;
  LocalEvent.emit(EventTypes.CloseAllModals);

  switch (pageName) {
    case Constants.PageName.Archive:
      NavigationService.navigate(ScreenName.ImportArchiveScreen, data);
      break;

    case Constants.PageName.List:
      NavigationService.navigate(ScreenName.ImportListScreen, data);
      break;

    case Constants.PageName.Thread:
      getTweetDataFromId(data).then(tweetData => {
        NavigationService.navigate(ScreenName.ThreadScreen, {tweetData});
      });
      break;
  }
};
