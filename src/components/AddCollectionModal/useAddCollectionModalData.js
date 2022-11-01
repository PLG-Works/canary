import {useState, useEffect, useCallback, useRef} from 'react';
import {collectionService} from '../../services/CollectionService';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';
import AnalyticsService from '../../services/AnalyticsService';
import {Constants} from '../../constants/Constants';

function useAddCollectionModalData() {
  const [isVisible, setIsVisible] = useState(false);
  const collectionNameRef = useRef('');
  const [modalData, setModalData] = useState(null);
  const warningText = useRef('');
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const _collectionService = collectionService();

  useEffect(() => {
    const onShowModal = payload => {
      setModalData(payload);
      if (payload?.name && payload?.id) {
        collectionNameRef.current = payload.name;
        setCharCount(payload?.name?.length);
      } else {
        setCharCount(0);
      }
      setIsVisible(true);
      setErrorMessage('');
    };

    LocalEvent.on(EventTypes.ShowAddCollectionModal, onShowModal);
    LocalEvent.on(EventTypes.CloseAllModals, closeModal);

    return () => {
      LocalEvent.off(EventTypes.ShowAddCollectionModal, onShowModal);
      LocalEvent.off(EventTypes.CloseAllModals, closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    collectionNameRef.current = '';
    warningText.current = '';
    setIsVisible(false);
  }, []);

  const onBackdropPress = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onCollectionNameChange = useCallback(newValue => {
    collectionNameRef.current = newValue;
    setCharCount(newValue?.length || 0);
    if (newValue?.length > 25) {
      warningText.current = 'Recommended name less than 25 chars';
    } else {
      warningText.current = '';
    }
  }, []);

  const onCreateCollectionPress = useCallback(() => {
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button + '_' + 'create_archive',
      Constants.TrackerConstants.EventActions.Press,
      {name: collectionNameRef.current},
    );

    if (collectionNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Archive name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }

    _collectionService
      .addCollection(collectionNameRef.current)
      .then(({collectionId}) => {
        Toast.show({
          type: ToastType.Success,
          text1: 'Archive created successfully.',
          position: ToastPosition.Top,
        });
        if (modalData?.tweetId) {
          _collectionService
            .addTweetToCollection(collectionId, modalData.tweetId)
            .then(() => {
              modalData?.onAddToCollectionSuccess?.(
                collectionNameRef.current,
                collectionId,
              );
              closeModal();
            })
            .catch(() => {});
        } else {
          modalData?.onCollectionAddSuccess();
          closeModal();
        }
      })
      .catch(err => {
        collectionNameRef.current = '';

        Toast.show({
          type: ToastType.Error,
          text1: 'Archive could not be created. Please try again',
          position: ToastPosition.Top,
        });
        setErrorMessage(err);
      })
      .finally(() => {
        _collectionService.getAllCollections();
      });
  }, [_collectionService, closeModal, modalData]);

  const onUpdateCollectionPress = useCallback(() => {
    AnalyticsService.track(
      Constants.TrackerConstants.EventEntities.Button + '_' + 'update_archive',
      Constants.TrackerConstants.EventActions.Press,
      {name: collectionNameRef.current},
    );

    if (collectionNameRef.current.trim().length === 0) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Archive name cannot be empty.',
        position: ToastPosition.Top,
      });
      return;
    }
    if (modalData?.name === collectionNameRef.current.trim()) {
      closeModal?.();
      return;
    }

    _collectionService
      .editCollection({
        id: modalData?.id,
        name: collectionNameRef.current,
      })
      .then(() => {
        LocalEvent.emit(EventTypes.UpdateCollection);
        Toast.show({
          type: ToastType.Success,
          text1: 'Archive updated successfully',
          position: ToastPosition.Top,
        });
        closeModal();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }, [_collectionService, closeModal, modalData?.id, modalData?.name]);

  return {
    isEditMode: !!modalData?.id,
    sDefaultValue: collectionNameRef.current,
    bIsVisible: isVisible,
    nCharacterCount: charCount,
    sWarningText: warningText.current,
    sErrorMessage: errorMessage,
    fnOnBackdropPress: onBackdropPress,
    fnOnCollectionNameChange: onCollectionNameChange,
    fnOnCreateCollectionPress: onCreateCollectionPress,
    fnOnUpdateCollectionPress: onUpdateCollectionPress,
  };
}

export default useAddCollectionModalData;
