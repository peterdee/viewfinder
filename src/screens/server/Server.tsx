import React, {memo, useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import {CONNECTION, SPACER} from '../../constants';
import type {ServerProps} from '../../types/navigation';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Server({navigation}: ServerProps): JSX.Element {
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [server, setServer] = useState<TcpSocket.Server>();

  const handleCreateServer = useCallback((): null | void => {
    if (connected) {
      return null;
    }

    setLoading(true);

    const TCPServer = TcpSocket.createServer(socket => {
      // handlers
      socket.on('data', data => {
        socket.write('Echo server ' + data);
      });

      socket.on('error', error => {
        console.log('An error ocurred with client socket ', error);
      });

      socket.on('close', error => {
        console.log('Closed connection with ', socket.address(), error);
      });
    }).listen({
      host: CONNECTION.serverHost,
      port: CONNECTION.port,
    });

    TCPServer.on('listening', (): void => {
      console.log(
        'started server on',
        CONNECTION.serverHost,
        ':',
        CONNECTION.port,
      );
      setConnected(true);
      setServer(TCPServer);
      setLoading(false);
    });

    TCPServer.on('error', error => {
      console.log('An error ocurred with the server', error);
    });

    TCPServer.on('close', () => {
      console.log('Server closed connection');
    });
  }, [connected]);

  const handleStopServer = useCallback((): void => {
    if (connected && server) {
      setLoading(true);
      server.close((): void => {
        setConnected(false);
        setLoading(false);
      });
    }
  }, [connected, server]);

  return (
    <View style={styles.wrap}>
      {connected && (
        <StyledButton disabled={loading} onPress={handleStopServer}>
          <Text style={styles.buttonText}>Stop server</Text>
        </StyledButton>
      )}
      {!connected && (
        <StyledButton disabled={loading} onPress={handleCreateServer}>
          <Text style={styles.buttonText}>Create server</Text>
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

export default memo(Server);
