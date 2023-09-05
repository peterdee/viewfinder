import React, {memo, useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import {CONNECTION} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Client(): JSX.Element {
  const [connected, setConnected] = useState<boolean>(false);
  // const [connection, setConnection] = useState<TcpSocket.Socket>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateClient = useCallback((): null | void => {
    if (!client) {
      const options = {
        port: 3030,
        host: '127.0.0.1',
        localAddress: '127.0.0.1',
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
        setClient(TCPClient);
        // Close socket
        // client.destroy();
        TCPClient.on('connect', () => console.log('connected'));
        TCPClient.on('error', e => console.log('err', e));
      });
    }
  }, [client]);

  return (
    <View style={styles.wrap}>
      <StyledButton disabled={loading} onPress={handleCreateClient}>
        <Text style={styles.buttonText}>Create client</Text>
      </StyledButton>
      <StyledButton onPress={(): void => console.log('back')}>
        <Text style={styles.buttonText}>Back</Text>
      </StyledButton>
    </View>
  );
}

export default memo(Client);
