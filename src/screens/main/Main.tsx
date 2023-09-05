import React, {memo} from 'react';
import {Text, View} from 'react-native';

import type {MainProps} from '../../types/navigation';
import {SPACER} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Main({navigation}: MainProps): JSX.Element {
  return (
    <View style={styles.wrap}>
      <View style={styles.controls}>
        <StyledButton
          customStyles={{
            width: SPACER * 9,
          }}
          onPress={(): void => navigation.navigate('Server')}>
          <Text style={styles.buttonText}>Create server</Text>
        </StyledButton>
        <StyledButton
          customStyles={{
            width: SPACER * 9,
          }}
          onPress={(): void => navigation.navigate('Client')}>
          <Text style={styles.buttonText}>Create client</Text>
        </StyledButton>
      </View>
    </View>
  );
}

export default memo(Main);
