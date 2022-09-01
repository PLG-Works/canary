import React, {useMemo} from 'react';
import {View, Text, ScrollView, Image, Linking} from 'react-native';
import RoundedButton from '../../components/common/RoundedButton';
import PreferenceSelector from '../../components/PreferenceSelector';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {usePreferenceScreenData} from './usePreferenceScreenData';
import fonts from '../../constants/fonts';
import Header from '../../components/common/Header';
import {
  AllUsersIcon,
  Canary,
  Information,
  rightArrowIcon,
  ShareAppIcon,
  VerifiedIconBlack,
} from '../../assets/common';
import {AppVersion} from '../../../AppVersion';
import {Constants} from '../../constants/Constants';
import {
  backUpDataToFirebase,
  clearData,
  restoreDataFromFirebase,
} from '../../services/BackupRestoreService';

function PreferenceScreen(props) {
  const localStyle = useStyleProcessor(style, 'PreferenceScreen');
  const data = props?.route?.params;
  const {
    bIsDoneButtonEnabled,
    bIsVerifiedUsersSelected,
    fnToggleUserPrefSelection,
    fnOnSelectedItemsUpdate,
    fnOnDonePress,
    fnOnInfoPress,
    fnOnShareAppPress,
  } = usePreferenceScreenData();

  const isNotOnboardingScreen = !!data?.enableBackButton;

  const roundedButtonStyle = useMemo(() => {
    const options = {
      style: localStyle.continueButton,
      text: isNotOnboardingScreen ? 'Save' : 'Take me to Home Feed',
      disabled: !bIsDoneButtonEnabled,
      textStyle: localStyle.continueButtonText,
      onPress: fnOnDonePress,
      underlayColor: colors.GoldenTainoi80,
    };

    if (isNotOnboardingScreen) {
      options.text = 'Save';
    } else {
      options.text = 'Take me to Home Feed';
      options.rightImage = rightArrowIcon;
      options.rightImageStyle = localStyle.continueButtonIcon;
    }

    return options;
  }, [
    bIsDoneButtonEnabled,
    fnOnDonePress,
    isNotOnboardingScreen,
    localStyle.continueButton,
    localStyle.continueButtonIcon,
    localStyle.continueButtonText,
  ]);

  return (
    <View style={localStyle.container}>
      {isNotOnboardingScreen ? (
        <Header
          enableBackButton={true}
          enableRightButton={true}
          onRightButtonClick={fnOnShareAppPress}
          rightButtonImage={ShareAppIcon}
          rightButtonImageStyle={localStyle.header.rightButtonImageStyle}
          enableSecondaryRightButton={true}
          onSecondaryRightButtonClick={fnOnInfoPress}
          secondaryRightButtonImage={Information}
          secondaryRightButtonImageStyle={
            localStyle.header.secondaryRightButtonImageStyle
          }
          rightButtonViewStyle={localStyle.header.rightButtonViewStyle}
        />
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={localStyle.contentContainer}>
          <View>
            <Text style={localStyle.titleText}>Personalise your Feed</Text>
            <View style={localStyle.titleSection}>
              <Text style={localStyle.subTitleText}>Select your Topics</Text>
              <Text style={localStyle.subText}>minimum 3</Text>
            </View>
          </View>
          <PreferenceSelector onSelectedItemsUpdate={fnOnSelectedItemsUpdate} />

          <View style={localStyle.titleSection}>
            <Text style={localStyle.subTitleText}>Show tweets from</Text>
            <Text style={localStyle.subText}>
              Verified users provide more relevancy in our opinion
            </Text>
          </View>

          <View style={localStyle.toggleButtonsContainer}>
            <RoundedButton
              text="Verified Users Only"
              leftImage={VerifiedIconBlack}
              style={[
                localStyle.toggleButton,
                bIsVerifiedUsersSelected ? localStyle.selectedToggleButton : {},
              ]}
              disabled={bIsVerifiedUsersSelected}
              shouldReduceOpacityWhenDisabled={false}
              textStyle={localStyle.toggleButtonText}
              leftImageStyle={localStyle.toggleButtonIcon}
              onPress={fnToggleUserPrefSelection}
              underlayColor={colors.GoldenTainoi20}
            />
            <RoundedButton
              text="All Users"
              leftImage={AllUsersIcon}
              onPress={fnToggleUserPrefSelection}
              style={[
                localStyle.toggleButton,
                !bIsVerifiedUsersSelected
                  ? localStyle.selectedToggleButton
                  : {},
              ]}
              shouldReduceOpacityWhenDisabled={false}
              disabled={!bIsVerifiedUsersSelected}
              textStyle={localStyle.toggleButtonText}
              leftImageStyle={localStyle.toggleButtonIcon}
              underlayColor={colors.GoldenTainoi20}
            />
          </View>

          <View style={localStyle.continueButtonContainer}>
            <RoundedButton {...roundedButtonStyle} />
          </View>
        </View>
        <View style={localStyle.backupRestoreContainer}>
          <RoundedButton
            text="BackUp"
            onPress={backUpDataToFirebase}
            style={localStyle.backupRestoreButton}
            textStyle={localStyle.continueButtonText}
            underlayColor={colors.GoldenTainoi80}
          />
          <RoundedButton
            text="Restore"
            onPress={restoreDataFromFirebase}
            style={localStyle.backupRestoreButton}
            textStyle={localStyle.continueButtonText}
            underlayColor={colors.GoldenTainoi80}
          />
          <RoundedButton
            text="Clear"
            onPress={clearData}
            style={localStyle.backupRestoreButton}
            textStyle={localStyle.continueButtonText}
            underlayColor={colors.GoldenTainoi80}
          />
        </View>
      </ScrollView>
      <View style={localStyle.bottomContainer}>
        <View style={localStyle.flexRow}>
          <Image source={Canary} style={localStyle.canaryIconStyle} />
          <Text style={localStyle.appNameText}>Canary</Text>
          <Text style={localStyle.appVersionText}>v{AppVersion}</Text>
        </View>
        <Text
          style={localStyle.madeByText}
          onPress={() => {
            Linking.openURL(Constants.PlgWorksLink);
          }}>
          Made with 🖤 by PLG Works
        </Text>
      </View>
    </View>
  );
}

export default React.memo(PreferenceScreen);

const style = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  contentContainer: {
    padding: layoutPtToPx(15),
    tablet: {
      alignItems: 'center',
      landscape: {
        maxWidth: '60%',
      },
    },
  },
  cancelTextStyle: {
    color: colors.GoldenTainoi,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    fontFamily: fonts.SoraSemiBold,
  },
  titleText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(30),
    lineHeight: layoutPtToPx(40),
    fontFamily: fonts.SoraSemiBold,
    tablet: {
      textAlign: 'center',
    },
  },
  titleSection: {
    marginTop: layoutPtToPx(20),
    tablet: {
      alignItems: 'center',
    },
  },
  subTitleText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(20),
    lineHeight: layoutPtToPx(25),
    fontFamily: fonts.SoraSemiBold,
    tablet: {
      textAlign: 'center',
    },
  },
  subText: {
    color: colors.BlackPearl50,
    fontSize: fontPtToPx(14),
    fontFamily: fonts.InterRegular,
  },
  continueButtonContainer: {
    marginVertical: layoutPtToPx(30),
    tablet: {
      width: '40%',
    },
  },
  continueButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  backupRestoreContainer: {
    flexDirection: 'row',
    paddingHorizontal: layoutPtToPx(10),
  },
  backupRestoreButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    marginHorizontal: layoutPtToPx(10),
  },
  continueButtonText: {
    marginHorizontal: layoutPtToPx(10),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    textTransform: 'capitalize',
  },
  continueButtonIcon: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
  },
  toggleButtonsContainer: {
    height: layoutPtToPx(50),
    flexDirection: 'row',
  },
  toggleButtonText: {
    textTransform: 'capitalize',
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(12),
    marginLeft: layoutPtToPx(4),
    color: colors.BlackPearl,
  },
  toggleButtonIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(12),
  },
  selectedToggleButton: {
    backgroundColor: colors.GoldenTainoi,
    borderColor: colors.GoldenTainoi20,
  },
  toggleButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    backgroundColor: colors.White,
    height: layoutPtToPx(30),
    borderRadius: layoutPtToPx(30),
    borderColor: colors.BlackPearl,
    borderWidth: layoutPtToPx(1),
    paddingHorizontal: layoutPtToPx(12),
    marginRight: layoutPtToPx(10),
  },
  bottomContainer: {
    alignItems: 'center',
    paddingVertical: layoutPtToPx(10),
  },
  flexRow: {
    flexDirection: 'row',
  },
  canaryIconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
  appNameText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    fontFamily: fonts.SoraSemiBold,
    marginLeft: layoutPtToPx(4),
    alignSelf: 'center',
  },
  appVersionText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    fontFamily: fonts.InterRegular,
    marginLeft: layoutPtToPx(4),
    alignSelf: 'center',
  },
  madeByText: {
    color: colors.BlackPearl,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(17),
    fontFamily: fonts.InterSemiBold,
    marginTop: layoutPtToPx(10),
  },
  header: {
    rightButtonViewStyle: {
      flexDirection: 'row',
    },
    rightButtonImageStyle: {
      tintColor: colors.GoldenTainoi,
      height: layoutPtToPx(22),
      width: layoutPtToPx(22),
      marginRight: 10,
    },
    secondaryRightButtonImageStyle: {
      tintColor: colors.GoldenTainoi,
      height: layoutPtToPx(22),
      width: layoutPtToPx(22),
      marginLeft: 10,
    },
  },
};
