import React, {memo, useEffect, useState} from 'react';
import {NetworkInfo} from 'react-native-network-info';
import {Text, View} from 'react-native';

import type {MainProps} from '../../types/navigation';
import {SPACER} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Main({navigation}: MainProps): JSX.Element {
  const [IPAddress, setIPAddress] = useState<string>('');
  const [IPV4Address, setIPV4Address] = useState<string>('');

  useEffect((): void => {
    NetworkInfo.getIPAddress().then((result: string | null): void => {
      if (result) {
        setIPAddress(result);
      }
    });
    NetworkInfo.getIPV4Address().then((result: string | null): void => {
      if (result) {
        setIPV4Address(result);
      }
    });
  }, []);

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
      <View style={styles.address}>
        <Text>{IPAddress}</Text>
      </View>
      <View style={styles.address}>
        <Text>{IPV4Address}</Text>
      </View>
    </View>
  );
}

export default memo(Main);
