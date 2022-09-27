import React, {useCallback, useRef, useState} from 'react';
import {View, Image} from 'react-native';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {CrossIcon, SearchIcon} from '../../assets/common';
import {isEmpty} from 'lodash';
import fonts from '../../constants/fonts';
import {TextInput, TouchableOpacity} from '@plgworks/applogger';

function SearchBar({
  searchQuery = '',
  onSearchPressCallback,
  onQueryChange,
  placeholderText,
  testID = '',
}) {
  let displayText = searchQuery;
  if (!isEmpty(searchQuery)) {
    const arr = displayText.split(':');
    if (arr[0] === 'from') {
      displayText = arr[1];
    }
  }
  const localStyle = useStyleProcessor(styles, 'SearchBar');
  const queryRef = useRef(displayText);
  const [query, setQuery] = useState(queryRef.current);
  const [isFocussed, setIsFocussed] = useState(false);
  const textInputRef = useRef(null);

  const onSearchPress = useCallback(() => {
    onSearchPressCallback?.(queryRef.current);
  }, [onSearchPressCallback]);

  const clearQuery = useCallback(() => {
    queryRef.current = '';
    setQuery(queryRef.current);
    onQueryChange?.('');
  }, [onQueryChange]);

  const updateQuery = useCallback(
    text => {
      queryRef.current = text;
      setQuery(queryRef.current);
      onQueryChange?.(text);
    },
    [onQueryChange],
  );

  const onTextInputFocussed = useCallback(() => {
    setIsFocussed(true);
  }, []);

  const onTextInputBlurred = useCallback(() => {
    setIsFocussed(false);
  }, []);

  return (
    <View
      style={
        isFocussed
          ? localStyle.searchContainerFocussed
          : localStyle.searchContainer
      }>
      <Image source={SearchIcon} style={localStyle.searchIconStyle} />
      <TextInput
        testID="search_bar"
        ref={textInputRef}
        onFocus={onTextInputFocussed}
        onBlur={onTextInputBlurred}
        style={localStyle.input}
        value={queryRef.current}
        cursorColor={colors.BlackPearl}
        placeholder={placeholderText || 'Search Tweets'}
        placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
        selectionColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
        onChangeText={updateQuery}
        onSubmitEditing={onSearchPress}
        returnKeyType="search"
        autoFocus={true}
      />

      {query.length > 0 && (
        <TouchableOpacity
          testID={`${testID}_search_bar`}
          onPress={clearQuery}
          style={localStyle.crossContainer}>
          <Image source={CrossIcon} style={localStyle.crossButtonStyle} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  searchContainer: {
    marginTop: layoutPtToPx(10),
    marginHorizontal: layoutPtToPx(20),
    borderWidth: 1,
    borderRadius: layoutPtToPx(4),
    paddingHorizontal: layoutPtToPx(10),
    borderColor: getColorWithOpacity(colors.BlackPearl, 0.2),
    backgroundColor: colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    height: layoutPtToPx(36),
    tablet: {
      marginTop: layoutPtToPx(20),
    },
  },
  searchContainerFocussed: {
    marginTop: layoutPtToPx(10),
    marginHorizontal: layoutPtToPx(20),
    borderWidth: 1,
    borderRadius: layoutPtToPx(4),
    paddingHorizontal: layoutPtToPx(10),
    borderColor: colors.Black,
    backgroundColor: colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    height: layoutPtToPx(36),
    tablet: {
      marginTop: layoutPtToPx(20),
    },
  },
  crossContainer: {
    padding: layoutPtToPx(5),
  },
  crossButtonStyle: {
    height: layoutPtToPx(16),
    width: layoutPtToPx(16),
  },
  input: {
    fontFamily: fonts.SoraRegular,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    color: colors.BlackPearl,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    flex: 1,
  },
  searchIconStyle: {
    tintColor: getColorWithOpacity(colors.BlackPearl, 0.2),
    height: layoutPtToPx(16),
    width: layoutPtToPx(16),
    marginRight: layoutPtToPx(8),
  },
};

export default React.memo(SearchBar);
