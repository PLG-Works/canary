import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {layoutPtToPx} from '../../utils/responsiveUI';
import ImageViewing from 'react-native-image-viewing/dist/ImageViewing';
import {useNavigation} from '@react-navigation/native';
import colors from '../../constants/colors';
import useBackButtonPress from '../../hooks/useBackButtonPress';

function ImageViewScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ImageViewScreen');
  const navigation = useNavigation();
  const {mediaArray, imageIndex} = props.route.params;
  const images = [];
  mediaArray.map(image => {
    images.push({uri: image?.url});
  });
  useBackButtonPress();

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <ImageViewing
          backgroundColor={colors.Black}
          images={images}
          imageIndex={imageIndex}
          visible={true}
          onRequestClose={() => {
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  headerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(50),
    flexDirection: 'row',
    backgroundColor: 'white',
  },
};

export default React.memo(ImageViewScreen);
