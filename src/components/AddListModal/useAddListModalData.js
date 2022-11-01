import {useState, useEffect, useCallback, useRef} from 'react';
import {listService} from '../../services/ListService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import AnalyticsService from '../../services/AnalyticsService';
import {Constants} from '../../constants/Constants';

function useAddListModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const listNameRef = useRef('');
  const warningText = useRef('');
  const [modalData, setModalData] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const _listService = listService();
  const isEditMode = !!modalData?.id;

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      const {id, name} = payload;
      if (id && name) {
        listNameRef.current = name;
        setCharCount(name.length);
      } else {
        setCharCount(0);
      }
      setIsVisible(true);
      setErrorMessage('');
    };

    LocalEvent.on(EventTypes.ShowAddListModal, onShowModal);
    LocalEvent.on(EventTypes.CloseAllModals, closeModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddListModal, onShowModal);
      LocalEvent.off(EventTypes.CloseAllModals, closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    listNameRef.current = '';
    warningText.current = '';

    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onListNameChange = useCallback(newValue => {
    listNameRef.current = newValue;
    setCharCount(newValue?.length || 0);
    if (newValue?.length > 25) {
      warningText.current = 'Recommended name less than 25 chars';
    } else {
      warningText.current = '';
    }
  }, []);

  const onCreateListPress = useCallback(() => {
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button + '_' + 'create_list',
      Constants.TrackerConstants.EventActions.Press,
      {name: listNameRef.current},
    );
    if (listNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'List name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }

    _listService
      .addList(listNameRef.current)
      .then(({listId}) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'List created successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.userName) {
          _listService
            .addUserToList(listId, modalData.userName)
            .then(() => {
              LocalEvent.emit(EventTypes.UpdateList);
              modalData?.onListAddSuccess(listNameRef.current, listId);
              closeModal();
            })
            .catch(() => {});
        } else {
          modalData?.onListAddSuccess();
          closeModal();
        }
      })
      .catch(err => {
        listNameRef.current = '';

        Toast.show({
          type: ToastType.Error,
          text1: 'List could not be created. Please try again',
          position: ToastPosition.Top,
        });
        setErrorMessage(err);
      })
      .finally(() => {
        _listService.getAllLists();
      });
  }, [_listService, closeModal, modalData]);

  const onEditListPress = useCallback(() => {
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button + '_' + 'update_list',
      Constants.TrackerConstants.EventActions.Press,
      {name: listNameRef.current},
    );

    if (listNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'List name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    if (modalData?.name === listNameRef.current.trim()) {
      closeModal?.();
      return;
    }
    _listService
      .editList({
        id: modalData?.id,
        name: listNameRef.current,
      })
      .then(() => {
        LocalEvent.emit(EventTypes.UpdateList);
        Toast.show({
          type: ToastType.Success,
          text1: 'List updated successfully',
          position: ToastPosition.Top,
        });
        closeModal();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }, [_listService, closeModal, modalData?.id, modalData?.name]);

  return {
    bIsEditMode: isEditMode,
    sDefaultValue: modalData?.name,
    bIsVisible: isVisible,
    nCharacterCount: charCount,
    sWarningText: warningText.current,
    sErrorMessage: errorMessage,
    fnOnBackdropPress: onBackdropPress,
    fnOnListNameChange: onListNameChange,
    fnOnCreateListPress: onCreateListPress,
    fnOnEditListPress: onEditListPress,
  };
}

export default useAddListModalData;
