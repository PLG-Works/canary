import React, {useCallback} from 'react';
import {Text, View, Image, TouchableWithoutFeedback} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';

function CollectionCard(props) {
  const {data} = props;
  const {imageUrl, collectionName, collectionId} = data;
  const localStyle = useStyleProcessor(styles, 'CollectionCard');

  const onCollectionPress = useCallback(() => {
    // TODO: Navigate to collection screen
    const _collectionService = collectionService();
    _collectionService.getCollectionDetails(collectionId).then(details => {
      console.log({details});
    });
  }, [collectionId]);

  return (
    <TouchableWithoutFeedback onPress={onCollectionPress}>
      <View style={localStyle.container}>
        <Image source={{uri: imageUrl}} style={localStyle.imageStyle} />
        <Text style={localStyle.textStyle}>{collectionName}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 6,
  },
  textStyle: {
    marginTop: 5,
    color: colors.SherpaBlue,
  },
  imageStyle: {
    height: 150,
    width: '100%',
    borderRadius: 6,
  },
};

export default React.memo(CollectionCard);