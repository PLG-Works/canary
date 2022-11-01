import {Anonymous, Discovery, Secure, CanaryLogo} from '../../assets/animation';
import {layoutPtToPx} from '../../utils/responsiveUI';

const LandingScreenCarousalData = [
  {
    id: 'welcome',
    videoAsset: CanaryLogo,
    animationStyle: {
      height: layoutPtToPx(260),
      width: layoutPtToPx(260),
    },
    primaryText: 'Welcome to Canary',
    secondaryText:
      'A privacy-focused app that lets you browse content from Twitter without being tracked',
  },
  {
    id: 'discover',
    animationAsset: Discovery,
    animationStyle: {
      height: layoutPtToPx(260),
      width: layoutPtToPx(260),
    },
    primaryText: 'Discover Content',
    secondaryText:
      'Personalize your home feed, search for topics, archive tweets, and create lists',
  },
  {
    id: 'anonymous',
    animationAsset: Anonymous,
    animationStyle: {
      height: layoutPtToPx(500),
      width: layoutPtToPx(500),
    },
    primaryText: 'Stay Anonymous',
    secondaryText:
      'All of this, without creating an account. We don’t ask for any permissions either!',
  },
  {
    id: 'private',
    animationAsset: Secure,
    animationStyle: {
      height: layoutPtToPx(432),
      width: layoutPtToPx(432),
    },
    primaryText: 'Stay Private & Secure',
    secondaryText:
      'All the data is stored only on your device, nowhere else — not even with us',
  },
];

export default LandingScreenCarousalData;
