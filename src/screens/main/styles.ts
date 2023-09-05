import {StyleSheet} from 'react-native';

import {SPACER} from '../../constants';

export default StyleSheet.create({
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACER,
    width: '100%',
  },
  wrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
