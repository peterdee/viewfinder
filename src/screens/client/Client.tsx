import React, {memo, useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import type {ClientProps} from '../../types/navigation';
import {CONNECTION, SPACER} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Client({navigation}: ClientProps): JSX.Element {
  const [connected, setConnected] = useState<boolean>(false);
  const [client, setClient] = useState<TcpSocket.Socket>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateClient = useCallback((): null | void => {
    if (!client) {
      setLoading(true);
      const options = {
        host: '127.0.0.1',
        localAddress: '127.0.0.1',
        port: CONNECTION.port,
        reuseAddress: true,
        // localPort: 20000,
        // interface: "wifi",
      };

      // Create socket
      const TCPClient = TcpSocket.createConnection(options, () => {
        // Write on the socket
        console.log('here');
        TCPClient.write('Hello server!');
        console.log(TCPClient.readyState);

        // Close socket
        // client.destroy();
        TCPClient.on('connect', () => console.log('connected'));
        TCPClient.on('error', e => console.log('err', e));
        setClient(TCPClient);
      });
    }
  }, [client]);

  const handleStopClient = useCallback((): void => {
    if (connected && client) {
      client.destroy();
      setConnected(false);
    }
  }, [client, connected]);

  return (
    <View style={styles.wrap}>
      {connected && (
        <StyledButton disabled={loading} onPress={handleStopClient}>
          <Text style={styles.buttonText}>Stop client</Text>
        </StyledButton>
      )}
      {!connected && (
        <StyledButton disabled={loading} onPress={handleCreateClient}>
          <Text style={styles.buttonText}>Start client</Text>
        </StyledButton>
      )}
      <StyledButton
        customStyles={{marginTop: SPACER}}
        onPress={(): void => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Back</Text>
      </StyledButton>
    </View>
  );
}

export default memo(Client);
